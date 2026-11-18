import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'agy_acp_writer.py'

FAKE = r'''#!/usr/bin/env python3
import json, os, subprocess, sys, time
scenario = os.environ.get('ACP_TEST_SCENARIO', 'success')
for line in sys.stdin:
    request = json.loads(line)
    method, ident = request.get('method'), request.get('id')
    result = {}
    if method == 'initialize': result = {'protocolVersion': 1}
    elif method == 'session/new':
        if scenario == 'prechunk':
            print(json.dumps({'jsonrpc':'2.0','method':'session/update','params':{'sessionId':'test-session','update':{'sessionUpdate':'agent_message_chunk','content':{'type':'text','text':'old text'}}}}), flush=True)
        result = {'sessionId': 'test-session'}
    elif method == 'session/set_model':
        assert request['params']['modelId'] == 'gemini-4-hydrogen-high'
    elif method == 'session/set_mode':
        assert request['params']['modeId'] == 'plan'
    elif method == 'session/prompt':
        if scenario == 'timeout': time.sleep(3)
        if scenario == 'child': subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(15)'])
        if scenario == 'permission':
            print(json.dumps({'jsonrpc':'2.0','id':91,'method':'session/request_permission','params':{}}), flush=True)
        if scenario not in ('empty', 'prechunk'):
            session = 'other-session' if scenario == 'wrong_session' else 'test-session'
            print(json.dumps({'jsonrpc':'2.0','method':'session/update','params':{'sessionId':session,'update':{'sessionUpdate':'agent_message_chunk','content':{'type':'text','text':'测试正文'}}}}, ensure_ascii=False), flush=True)
        result = {'stopReason': 'cancelled' if scenario == 'cancelled' else 'end_turn'}
    else: continue
    print(json.dumps({'jsonrpc':'2.0','id':ident,'result':result}), flush=True)
    if method == 'session/set_mode' and scenario == 'blocked_stdin': time.sleep(4)
'''


class AcpWriterTest(unittest.TestCase):
    def run_scenario(self, scenario):
        import os, time
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            fake = root / 'fake-agy'
            fake.write_text(FAKE, encoding='utf-8')
            fake.chmod(0o700)
            prompt = root / 'prompt.md'
            prompt.write_text('只写正文' * (1000000 if scenario == 'blocked_stdin' else 1), encoding='utf-8')
            output = root / 'result.json'
            env = dict(os.environ, ACP_TEST_SCENARIO=scenario)
            started = time.monotonic()
            result = subprocess.run([sys.executable, str(SCRIPT), '--agy-bin', str(fake), '--prompt-file', str(prompt), '--output-file', str(output), '--cwd', directory, '--timeout-seconds', '1'], capture_output=True, text=True, env=env, timeout=8)
            if scenario == 'blocked_stdin':
                self.assertLess(time.monotonic() - started, 3, 'timeout must include blocked writes')
            return result, json.loads(output.read_text()) if output.exists() else None

    def test_success_requires_model_mode_nonempty_and_end_turn(self):
        result, record = self.run_scenario('success')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(record['status'], 'SUCCESS')
        self.assertEqual(record['model'], 'gemini-4-hydrogen-high')
        self.assertEqual(record['stop_reason'], 'end_turn')
        self.assertEqual(record['response'], '测试正文')

    def test_empty_cancelled_timeout_and_permission_do_not_succeed(self):
        for scenario in ('empty', 'cancelled', 'timeout', 'permission', 'prechunk', 'wrong_session', 'blocked_stdin'):
            with self.subTest(scenario=scenario):
                result, record = self.run_scenario(scenario)
                self.assertNotEqual(result.returncode, 0)
                self.assertNotEqual(record and record.get('status'), 'SUCCESS')

    def test_child_inheriting_pipes_cannot_hang_cleanup(self):
        result, record = self.run_scenario('child')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(record['status'], 'SUCCESS')

if __name__ == '__main__': unittest.main()
