#!/usr/bin/env python3
"""Build a deterministic Pot 3.0.7 .potext with plugin files at archive root."""
import argparse
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT / 'dist')
    args = parser.parse_args()
    info = json.loads((ROOT / 'info.json').read_text())
    name = info['id']
    if not name.startswith('plugin.') or any(c in name for c in '/\\'):
        raise SystemExit('Plugin ID must be a safe plugin.* filename')
    if info.get('plugin_type') != 'translate':
        raise SystemExit('Expected a translation plugin')
    args.output.mkdir(parents=True, exist_ok=True)
    output = args.output / (name + '.potext')
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for filename in ['info.json', 'main.js', info['icon'], 'README.md', 'CHANGELOG.md', 'TESTING.md']:
            entry = zipfile.ZipInfo(filename, date_time=(2026, 11, 4, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, (ROOT / filename).read_bytes())
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        assert {'info.json', 'main.js', info['icon']} <= set(archive.namelist())
    print(output)


if __name__ == '__main__':
    main()
