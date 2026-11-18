#!/usr/bin/env python3
"""Run one noninteractive Hydrogen writing session via agy's ACP transport."""
import argparse
import json
import os
import queue
import select
import signal
import subprocess
import sys
import threading
import time
from pathlib import Path

MODEL = 'gemini-4-hydrogen-high'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--prompt-file', required=True, type=Path)
    parser.add_argument('--output-file', required=True, type=Path)
    parser.add_argument('--cwd', default='.')
    parser.add_argument('--agy-bin', default='agy')
    parser.add_argument('--timeout-seconds', type=float, default=720)
    args = parser.parse_args()
    if args.timeout_seconds <= 0:
        parser.error('--timeout-seconds must be positive')
    prompt = args.prompt_file.read_text(encoding='utf-8')
    if not prompt.strip():
        parser.error('prompt is empty')

    messages = queue.Queue()
    chunks = []
    record = {'status': 'ERROR', 'model': MODEL, 'response': '', 'stop_reason': None}
    process = None
    session = None
    readers = []
    deadline = time.monotonic() + args.timeout_seconds

    def reader(stream, source):
        for line in stream:
            messages.put((source, line))
        messages.put((source, None))

    def send(message):
        data = memoryview((json.dumps(message, ensure_ascii=False) + '\n').encode('utf-8'))
        fd = process.stdin.fileno()
        while data:
            remaining = deadline - time.monotonic()
            if remaining <= 0 or not select.select([], [fd], [], max(0, remaining))[1]:
                raise TimeoutError('ACP request exceeded the time limit while sending')
            try:
                written = os.write(fd, data)
            except BlockingIOError:
                continue
            data = data[written:]

    def request(ident, method, params):
        send({'jsonrpc': '2.0', 'id': ident, 'method': method, 'params': params})
        while True:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise TimeoutError('ACP request exceeded the time limit')
            try:
                source, line = messages.get(timeout=remaining)
            except queue.Empty as exc:
                raise TimeoutError('ACP request exceeded the time limit') from exc
            if source == 'stderr':
                continue
            if line is None:
                raise RuntimeError('ACP server closed before completing the request')
            try:
                message = json.loads(line)
            except json.JSONDecodeError as exc:
                raise RuntimeError('ACP server returned invalid JSON') from exc
            if message.get('method') == 'session/request_permission':
                send({'jsonrpc': '2.0', 'id': message['id'], 'result': {'outcome': {'outcome': 'cancelled'}}})
                raise RuntimeError('ACP requested tool permission during a writing-only session')
            if message.get('method') == 'session/update':
                update = message.get('params', {}).get('update', {})
                kind = update.get('sessionUpdate')
                if kind in ('tool_call', 'tool_call_update'):
                    raise RuntimeError('ACP attempted a tool call during a writing-only session')
                content = update.get('content', {})
                if ident == 5 and message.get('params', {}).get('sessionId') == session and kind == 'agent_message_chunk' and content.get('type') == 'text':
                    chunks.append(content.get('text', ''))
            if message.get('id') == ident and ('result' in message or 'error' in message):
                if 'error' in message:
                    error = message['error']
                    raise RuntimeError('ACP error: ' + str(error.get('message', error)))
                return message['result']

    try:
        process = subprocess.Popen([args.agy_bin, 'acp', '--stdio'], cwd=args.cwd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', bufsize=1, start_new_session=True)
        os.set_blocking(process.stdin.fileno(), False)
        for stream, source in ((process.stdout, 'stdout'), (process.stderr, 'stderr')):
            thread = threading.Thread(target=reader, args=(stream, source), daemon=True)
            thread.start()
            readers.append(thread)
        request(1, 'initialize', {'protocolVersion': 1, 'clientCapabilities': {}, 'clientInfo': {'name': 'knowledge-writer', 'version': '1.0'}})
        session = request(2, 'session/new', {'cwd': str(Path(args.cwd).resolve()), 'mcpServers': []})['sessionId']
        record['session_id'] = session
        request(3, 'session/set_model', {'sessionId': session, 'modelId': MODEL})
        request(4, 'session/set_mode', {'sessionId': session, 'modeId': 'plan'})
        result = request(5, 'session/prompt', {'sessionId': session, 'prompt': [{'type': 'text', 'text': prompt}]})
        record['response'] = ''.join(chunks)
        record['stop_reason'] = result.get('stopReason')
        if record['stop_reason'] != 'end_turn' or not record['response'].strip():
            raise RuntimeError('ACP response was empty or did not finish with end_turn')
        record['status'] = 'SUCCESS'
    except (OSError, KeyError, RuntimeError, TimeoutError) as exc:
        record['response'] = ''.join(chunks)
        record['error'] = str(exc)
    finally:
        if process is not None:
            # A child may inherit ACP pipes. Limit cleanup to this process group
            # so a shared Antigravity service or unrelated session is untouched.
            try:
                os.killpg(process.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
            try:
                process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                pass
            try:
                os.killpg(process.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            process.wait(timeout=2)
            process.stdin.close()
            for thread, stream in zip(readers, (process.stdout, process.stderr)):
                thread.join(timeout=1)
                if not thread.is_alive():
                    stream.close()
        args.output_file.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('ACP writing status:', record['status'], file=sys.stderr)
    if record['status'] != 'SUCCESS':
        print(record.get('error', 'ACP request failed'), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
