#!/usr/bin/env python3
"""Copy lab animations from the teardown repo into static/lab/ and (re)capture thumbnails.

Reads data/lab.json. For every item:
  <teardown>/<group.teardown_dir>/<slug>.html  ->  static/lab/<group.id>/<slug>.html
  thumbnail at t = item.thumb_t seconds          ->  static/lab/<group.id>/thumbs/<slug>.jpg

Usage:
  python3 lab/sync.py                 copy every item; capture thumbnails that are missing
  python3 lab/sync.py lesson2         only items whose slug starts with "lesson2"
  python3 lab/sync.py --thumbs        also recapture existing thumbnails
  python3 lab/sync.py --check         copy nothing, only run the checks on static/lab/

Env: TEARDOWN (default ~/Documents/GitHub/teardown),
     CHROMIUM (default /Applications/Google Chrome.app/Contents/MacOS/Google Chrome).
Thumbnails use headless system Chrome with real WebGL (Metal) and macOS `sips`.
"""
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATIC = ROOT / 'static' / 'lab'
TEARDOWN = Path(os.environ.get('TEARDOWN', Path.home() / 'Documents/GitHub/teardown'))
CHROME = os.environ.get('CHROMIUM', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')

# Nothing employer-branded or compliance-numbered goes on the public blog.
BANNED = re.compile(r'csop|南方东英|SFC\s*CE|CE\s*No', re.I)
# Pages must stay offline single files: no remote scripts, styles or fonts.
REMOTE = re.compile(r'<(?:script|link)[^>]+(?:src|href)=["\']https?://', re.I)


def check(path):
    text = path.read_text(encoding='utf-8')
    errors = []
    if m := BANNED.search(text):
        errors.append(f'banned text {m.group(0)!r}')
    if m := REMOTE.search(text):
        errors.append(f'remote asset {m.group(0)!r}')
    return errors


def thumb(page, t, out):
    """Seek the page to t seconds in headless Chrome and save a 960px JPEG."""
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        probe = Path(tmp) / 'page.html'
        html = page.read_text(encoding='utf-8')
        seek = f'<script>setTimeout(()=>window.seek&&seek({t}),800)</script></body>'
        probe.write_text(html.replace('</body>', seek, 1), encoding='utf-8')
        png = Path(tmp) / 'shot.png'
        subprocess.run([CHROME, '--headless=new', '--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal',
                        '--hide-scrollbars', '--window-size=1920,1080', '--virtual-time-budget=5000',
                        f'--screenshot={png}', probe.as_uri()],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(['sips', '-Z', '960', '-s', 'format', 'jpeg', '-s', 'formatOptions', '78', str(png), '--out', str(out)],
                       check=True, stdout=subprocess.DEVNULL)
    print(f'  thumb {out.relative_to(ROOT)} @ {t}s')


def main(argv):
    recapture = '--thumbs' in argv
    only_check = '--check' in argv
    prefixes = tuple(a for a in argv if not a.startswith('--'))
    groups = json.loads((ROOT / 'data' / 'lab.json').read_text(encoding='utf-8'))['groups']
    failed = False
    for g in groups:
        for item in g['items']:
            slug = item['slug']
            if prefixes and not slug.startswith(prefixes):
                continue
            dst = STATIC / g['id'] / f'{slug}.html'
            if not only_check:
                src = TEARDOWN / g['teardown_dir'] / f'{slug}.html'
                if not src.exists():
                    sys.exit(f'missing {src}; build it in teardown first')
                errors = check(src)
                if errors:
                    print(f'SKIP {src}: {"; ".join(errors)}')
                    failed = True
                    continue
                dst.parent.mkdir(parents=True, exist_ok=True)
                dst.write_bytes(src.read_bytes())
                print(f'copy {dst.relative_to(ROOT)} {dst.stat().st_size / 1e6:.2f} MB')
                jpg = STATIC / g['id'] / 'thumbs' / f'{slug}.jpg'
                if recapture or not jpg.exists():
                    thumb(dst, item.get('thumb_t', 5), jpg)
            elif dst.exists():
                errors = check(dst)
                print(f'{"FAIL" if errors else "ok  "} {dst.relative_to(ROOT)} {"; ".join(errors)}')
                failed |= bool(errors)
            else:
                print(f'FAIL {dst.relative_to(ROOT)} missing')
                failed = True
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main(sys.argv[1:])
