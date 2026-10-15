#!/usr/bin/env python3
"""Gera sitemap.xml da Black Void a partir da lista explícita de páginas públicas.

- Domínio canônico: https://blackvoid.dev (o mesmo declarado em robots.txt e na
  tag canonical de pages/ia-crawler.html).
- lastmod é derivado do git (último commit que tocou o arquivo) ou, se o arquivo
  ainda não estiver versionado, da data de modificação no disco. Não inventa datas.
- Uso: python3 scripts/generate-sitemap.py
"""
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from xml.dom import minidom

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://blackvoid.dev'
OUT = ROOT / 'sitemap.xml'

# (path público, arquivo-fonte para lastmod, changefreq, priority)
# Somente páginas públicas, existentes, canônicas e indexáveis.
# Excluídas de propósito: /ia-crawler.html (canonical aponta para /),
# black-void-pages/404.html (erro), equipe/arthur/release (artefato de build),
# docs/ (páginas internas de documentação, já fora do sitemap anterior).
URLS = [
    ('/',                              'home.html',                'weekly',  '1.0'),
    ('/pages/sobre.html',              'pages/sobre.html',         'monthly', '0.8'),
    ('/pages/servicos.html',           'pages/servicos.html',      'monthly', '0.8'),
    ('/pages/ia.html',                 'pages/ia.html',            'monthly', '0.8'),
    ('/pages/desenvolvimento.html',    'pages/desenvolvimento.html','monthly', '0.8'),
    ('/pages/automacao.html',          'pages/automacao.html',     'monthly', '0.8'),
    ('/pages/infraestrutura.html',     'pages/infraestrutura.html','monthly', '0.8'),
    ('/pages/cybersecurity.html',      'pages/cybersecurity.html', 'monthly', '0.8'),
    ('/pages/branding.html',           'pages/branding.html',      'monthly', '0.8'),
    ('/pages/portfolio.html',          'pages/portfolio.html',     'monthly', '0.7'),
    ('/pages/casos.html',              'pages/casos.html',         'monthly', '0.7'),
    ('/pages/ecossistema.html',        'pages/ecossistema.html',   'monthly', '0.7'),
    ('/pages/kira.html',               'pages/kira.html',          'monthly', '0.7'),
    ('/pages/tecnologias.html',        'pages/tecnologias.html',   'monthly', '0.6'),
    ('/pages/sistemas.html',           'pages/sistemas.html',      'monthly', '0.6'),
    ('/pages/contato.html',            'pages/contato.html',       'monthly', '0.6'),
    ('/pages/team.html',               'pages/team.html',          'monthly', '0.5'),
    ('/pages/carreira.html',           'pages/carreira.html',      'monthly', '0.5'),
    ('/pages/blog.html',               'pages/blog.html',          'weekly',  '0.5'),
    ('/pages/recursos.html',           'pages/recursos.html',      'monthly', '0.5'),
    ('/pages/faq.html',                'pages/faq.html',           'monthly', '0.5'),
    ('/pages/planos.html',             'pages/planos.html',        'monthly', '0.5'),
    ('/pages/documentacao.html',       'pages/documentacao.html',  'monthly', '0.5'),
    ('/politica-de-privacidade',       'pages/politica-de-privacidade.html', 'yearly', '0.5'),
    ('/pages/arthur.html',             'pages/arthur.html',        'monthly', '0.4'),
    ('/equipe/arthur/',                'equipe/arthur/index.html', 'monthly', '0.4'),
    ('/pages/Starter.html',            'pages/Starter.html',       'monthly', '0.4'),
    ('/pages/em-breve.html',           'pages/em-breve.html',      'monthly', '0.3'),
]


def lastmod_for(rel_path: str) -> str:
    f = ROOT / rel_path
    if not f.exists():
        print(f'ERRO: arquivo não existe: {rel_path}', file=sys.stderr)
        sys.exit(1)
    try:
        out = subprocess.run(
            ['git', '-C', str(ROOT), 'log', '-1', '--format=%cs', '--', rel_path],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        if out:
            return out
    except Exception:
        pass
    # Arquivo ainda não versionado: data real de modificação em disco (UTC).
    return datetime.fromtimestamp(f.stat().st_mtime, tz=timezone.utc).date().isoformat()


def main() -> None:
    seen = set()
    entries = []
    for path, src, freq, prio in URLS:
        loc = BASE + path
        if loc in seen:
            print(f'ERRO: URL duplicada: {loc}', file=sys.stderr)
            sys.exit(1)
        seen.add(loc)
        lastmod = lastmod_for(src)
        entries.append((loc, lastmod, freq, prio))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod, freq, prio in entries:
        lines += ['  <url>',
                  f'    <loc>{loc}</loc>',
                  f'    <lastmod>{lastmod}</lastmod>',
                  f'    <changefreq>{freq}</changefreq>',
                  f'    <priority>{prio}</priority>',
                  '  </url>']
    lines.append('</urlset>')
    xml = '\n'.join(lines) + '\n'

    # Auto-validação: XML bem-formado + todas as URLs absolutas HTTPS.
    minidom.parseString(xml)
    locs = re.findall(r'<loc>([^<]+)</loc>', xml)
    assert all(u.startswith('https://') for u in locs), 'URL não-HTTPS encontrada'
    OUT.write_text(xml, encoding='utf-8')
    print(f'sitemap.xml: {len(locs)} URLs gravadas em {OUT.relative_to(ROOT)} (base {BASE})')
    for u in locs:
        print(f'  {u}')


if __name__ == '__main__':
    main()
