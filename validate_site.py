from pathlib import Path
from urllib.parse import urlparse
import re

ROOT = Path(__file__).parent
html_files = [p for p in ROOT.rglob('*.html') if 'node_modules' not in p.parts and '.git' not in p.parts and 'release' not in p.parts]
missing = []
missing_images = []
external = 0
links = 0
for page in html_files:
    text = page.read_text(encoding='utf-8', errors='ignore')
    for target in re.findall(r'(?:href|src)=["\']([^"\']+)["\']', text):
        if target.startswith(('#', 'mailto:', 'tel:', 'data:', 'http:', 'https:', '/manus-storage/', '/src/')):
            external += 1
            continue
        links += 1
        clean = target.split('#', 1)[0].split('?', 1)[0]
        if not clean:
            continue
        candidate = (page.parent / clean).resolve()
        if not candidate.exists():
            missing.append((page.relative_to(ROOT), target))
    for target in re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', text):
        if target.startswith(('http:', 'https:', 'data:', '/manus-storage/')):
            continue
        candidate = (page.parent / target.split('?', 1)[0]).resolve()
        if not candidate.exists():
            missing_images.append((page.relative_to(ROOT), target))

print(f'html={len(html_files)} internal_links={links} external_or_runtime={external}')
if missing:
    print('MISSING')
    for page, target in missing[:80]:
        print(f'{page}: {target}')
    raise SystemExit(1)
print('missing=0')
if missing_images:
    print('MISSING_IMAGES')
    for page, target in missing_images[:80]:
        print(f'{page}: {target}')
    raise SystemExit(1)
print(f'missing_images=0')
