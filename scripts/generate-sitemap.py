#!/usr/bin/env python3
"""Gera sitemap.xml da Black Void a partir da lista explícita de páginas públicas.

- Domínio canônico: https://www.blackvoid.dev — é o domínio que responde em
  produção; o apex blackvoid.dev redireciona para o www (verificado por
  requisição pública em 2026-10-15). O sitemap DEVE usar o mesmo host que o
  serve, sem depender de redirecionamento (causa do erro "Não foi possível
  buscar o sitemap" no Search Console).
- lastmod é derivado do git (último commit que tocou o arquivo) ou, se o arquivo
  ainda não estiver versionado, da data de modificação no disco. Não inventa
  datas e não é atualizado a cada build — só muda quando o conteúdo muda.
- Sem priority/changefreq: o Google os ignora; o sitemap fica enxuto e fiel
  ao estado real do site.
- Uso: python3 scripts/generate-sitemap.py
"""
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from xml.dom import minidom

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://www.blackvoid.dev'
OUT = ROOT / 'sitemap.xml'

# Caminhos públicos canônicos + arquivo-fonte que define o lastmod.
# Somente páginas existentes, públicas, indexáveis e com resposta 200 direta.
# Excluídas de propósito: /ia-crawler.html (canonical aponta para /),
# black-void-pages/404.html (erro), equipe/arthur/release (artefato de build),
# docs/ (documentação interna, fora do padrão de indexação do site).
URLS = [
    ('/',                              'home.html'),
    ('/pages/sobre.html',              'pages/sobre.html'),
    ('/pages/servicos.html',           'pages/servicos.html'),
    ('/pages/ia.html',                 'pages/ia.html'),
    ('/pages/desenvolvimento.html',    'pages/desenvolvimento.html'),
    ('/pages/automacao.html',          'pages/automacao.html'),
    ('/pages/infraestrutura.html',     'pages/infraestrutura.html'),
    ('/pages/cybersecurity.html',      'pages/cybersecurity.html'),
    ('/pages/branding.html',           'pages/branding.html'),
    ('/pages/portfolio.html',          'pages/portfolio.html'),
    ('/pages/casos.html',              'pages/casos.html'),
    ('/pages/ecossistema.html',        'pages/ecossistema.html'),
    ('/pages/kira.html',               'pages/kira.html'),
    ('/pages/tecnologias.html',        'pages/tecnologias.html'),
    ('/pages/sistemas.html',           'pages/sistemas.html'),
    ('/pages/contato.html',            'pages/contato.html'),
    ('/pages/team.html',               'pages/team.html'),
    ('/pages/carreira.html',           'pages/carreira.html'),
    ('/pages/blog.html',               'pages/blog.html'),
    ('/pages/recursos.html',           'pages/recursos.html'),
    ('/pages/faq.html',                'pages/faq.html'),
    ('/pages/planos.html',             'pages/planos.html'),
    ('/pages/documentacao.html',       'pages/documentacao.html'),
    ('/politica-de-privacidade',       'pages/politica-de-privacidade.html'),
    ('/pages/arthur.html',             'pages/arthur.html'),
    ('/equipe/arthur/',                'equipe/arthur/index.html'),
    ('/pages/Starter.html',            'pages/Starter.html'),
    ('/pages/em-breve.html',           'pages/em-breve.html'),
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
    for path, src in URLS:
        loc = BASE + path
        if loc in seen:
            print(f'ERRO: URL duplicada: {loc}', file=sys.stderr)
            sys.exit(1)
        seen.add(loc)
        entries.append((loc, lastmod_for(src)))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in entries:
        lines += ['  <url>',
                  f'    <loc>{loc}</loc>',
                  f'    <lastmod>{lastmod}</lastmod>',
                  '  </url>']
    lines.append('</urlset>')
    xml = '\n'.join(lines) + '\n'

    # Auto-validação: XML bem-formado + todas as URLs absolutas HTTPS no canônico.
    minidom.parseString(xml)
    locs = re.findall(r'<loc>([^<]+)</loc>', xml)
    assert all(u.startswith(BASE) for u in locs), f'URL fora do canônico {BASE}'
    OUT.write_text(xml, encoding='utf-8')
    print(f'sitemap.xml: {len(locs)} URLs gravadas em {OUT.relative_to(ROOT)} (base {BASE})')
    for u in locs:
        print(f'  {u}')


if __name__ == '__main__':
    main()
