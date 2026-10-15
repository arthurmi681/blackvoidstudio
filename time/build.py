#!/usr/bin/env python3
"""Gerador da plataforma Time — Black Void (time.blackvoid.dev).

Site estático sem framework: lê data/members.json e gera HTML semanticamente
idêntico para todos os perfis, além de sitemap.xml, robots.txt e 404.html.
Ativos (fontes/imagens/documentos) são copiados de suas fontes únicas no
repositório (equipe/arthur/* e pages/assets/img/logo.png) para manter o
projeto autocontido — a pasta time/ é a raiz de um projeto Vercel próprio.

Uso: python3 time/build.py
"""
import html
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from xml.dom import minidom

ROOT = Path(__file__).resolve().parent          # time/
REPO = ROOT.parent                              # repositório
DATA = ROOT / 'data' / 'members.json'

FONT_SRC = REPO / 'equipe' / 'arthur' / 'release' / 'assets'
IMG_SRC = REPO / 'equipe' / 'arthur' / 'public' / 'images'
DOC_SRC = REPO / 'equipe' / 'arthur' / 'public' / 'docs'

ASSETS = {
    FONT_SRC / 'instrument-serif-latin-400-normal-DnYpCC2O.woff2': 'assets/fonts/instrument-serif-latin-400-normal.woff2',
    FONT_SRC / 'manrope-latin-wght-normal-DHIcAJRg.woff2': 'assets/fonts/manrope-latin-wght-normal.woff2',
    FONT_SRC / 'manrope-latin-ext-wght-normal-Ch3YOpNY.woff2': 'assets/fonts/manrope-latin-ext-wght-normal.woff2',
    IMG_SRC / 'arthur-urban.webp': 'assets/img/arthur-urban.webp',
    IMG_SRC / 'arthur-portrait.webp': 'assets/img/arthur-portrait.webp',
    IMG_SRC / 'creative-work.webp': 'assets/img/creative-work.webp',
    IMG_SRC / 'developer-setup.webp': 'assets/img/developer-setup.webp',
    IMG_SRC / 'arthur-human.webp': 'assets/img/arthur-human.webp',
    DOC_SRC / 'curriculo-arthur-miyazaki.pdf': 'assets/docs/curriculo-arthur-miyazaki.pdf',
    REPO / 'pages' / 'assets' / 'img' / 'logo.png': 'assets/img/logo.png',
}

E = lambda s: html.escape(str(s), quote=True)


def lastmod_for(rel: str) -> str:
    f = REPO / rel
    try:
        out = subprocess.run(['git', '-C', str(REPO), 'log', '-1', '--format=%cs', '--', rel],
                             capture_output=True, text=True, check=True).stdout.strip()
        if out:
            return out
    except Exception:
        pass
    return datetime.fromtimestamp(f.stat().st_mtime, tz=timezone.utc).date().isoformat()


def jsl(obj) -> str:
    """JSON-LD seguro para embutir em <script>."""
    return json.dumps(obj, ensure_ascii=False, indent=2).replace('</', '<\\/')


def validate(data: dict) -> None:
    slugs = []
    for m in data['members']:
        slug = m.get('slug', '')
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
            sys.exit(f"ERRO: slug inválido: {slug!r}")
        slugs.append(slug)
        for field in ('name', 'role', 'location', 'headline', 'bio', 'photo', 'links'):
            if field not in m:
                sys.exit(f"ERRO: membro {slug}: campo obrigatório ausente: {field}")
    if len(slugs) != len(set(slugs)):
        sys.exit('ERRO: slugs duplicados')


def head(site, *, title, description, canonical, og_type='website', og_image=None, json_ld=None, robots='index, follow') -> str:
    og_image = og_image or f"{site['origin']}/assets/img/arthur-urban.webp"
    og_url = canonical or site['origin']
    ld = f'\n  <script type="application/ld+json">\n{jsl(json_ld)}\n  </script>' if json_ld else ''
    can = f'\n  <link rel="canonical" href="{E(canonical)}">' if canonical else ''
    return f'''<!doctype html>
<html lang="{E(site['locale'])}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{E(title)}</title>
  <meta name="description" content="{E(description)}">
  <meta name="robots" content="{robots}">{can}
  <meta property="og:type" content="{og_type}">
  <meta property="og:site_name" content="{E(site['name'])}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="{E(title)}">
  <meta property="og:description" content="{E(description)}">
  <meta property="og:url" content="{E(og_url)}">
  <meta property="og:image" content="{E(og_image)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{E(title)}">
  <meta name="twitter:description" content="{E(description)}">
  <meta name="twitter:image" content="{E(og_image)}">
  <link rel="icon" href="{{FAVICON}}">
  <link rel="stylesheet" href="{{CSS}}">{ld}
</head>'''


def page_head(site, css_prefix, **kw) -> str:
    return head(site, **kw).replace('{FAVICON}', f'{css_prefix}assets/img/logo.png').replace('{CSS}', f'{css_prefix}assets/css/time.css')


def home_page(site, members) -> str:
    cards = []
    for i, m in enumerate(members):
        p = m['photo']
        cards.append(f'''      <a class="member-card enter enter--{min(i+1,3)}" href="{m['slug']}">
        <div class="member-card__photo"><img src="{E(p['src'])}" alt="{E(p['alt'])}" width="{p['width']}" height="{p['height']}" loading="lazy"></div>
        <div>
          <h2 class="member-card__name">{E(m['name'])}</h2>
          <p class="member-card__role">{E(m['role'])} · {E(m['discipline'])}</p>
          <hr class="member-card__line">
          <span class="meta">{E(m['location'])}</span>
        </div>
        <span class="member-card__cta">Ver perfil</span>
      </a>''')
    cards.append('''      <div class="member-card member-card--soon" aria-hidden="true">
        <span class="eyebrow">Próximos perfis</span>
        <h2 class="display">Em<br>formação.</h2>
        <span class="meta">Novos integrantes entram pelo mesmo arquivo.</span>
      </div>''')
    count = len(members)
    json_ld = {
        '@context': 'https://schema.org', '@type': 'CollectionPage',
        'name': site['name'], 'url': site['origin'], 'description': site['description'],
        'isPartOf': {'@type': 'WebSite', 'name': 'Black Void Studio', 'url': site['mainSite']},
        'about': {'@type': 'Organization', 'name': 'Black Void Studio', 'url': site['mainSite']},
    }
    main = f'''  <main id="conteudo">
    <section class="team-hero"><div class="wrap">
      <p class="kicker enter">Time / Black Void</p>
      <h1 class="display enter enter--1">A equipe por trás<br>do <em>vazio.</em></h1>
      <p class="lead enter enter--2">Somos uma equipe compacta porque proximidade é parte do método. As melhores decisões acontecem quando a pergunta consegue atravessar o espaço entre quem pensa e quem constrói.</p>
      <div class="team-hero__meta enter enter--3">
        <span class="meta">Dourados · MS · Brasil</span>
        <span class="meta">{count:02d} perfil publicado</span>
        <span class="meta">Arquivo vivo / 2026</span>
      </div>
    </div></section>

    <section class="block" aria-labelledby="tit-equipe"><div class="wrap">
      <div class="section-index"><b>01</b><span id="tit-equipe">Equipe / Perfis</span></div>
      <div class="members-grid">
{chr(10).join(cards)}
      </div>
    </div></section>

    <section class="block" aria-labelledby="tit-estudio"><div class="wrap">
      <div class="section-index"><b>02</b><span id="tit-estudio">Estúdio / Institucional</span></div>
      <div class="split">
        <div>
          <p class="kicker">Black Void Studio</p>
          <h2 class="h-lg">Profundidade em vez<br>de <em>acumular camadas.</em></h2>
        </div>
        <div>
          <p class="lead" style="font-size:16px">Black Void é um estúdio de inteligência, software e infraestrutura para empresas que preferem operar com profundidade. Esta plataforma é o arquivo público da equipe; o estúdio vive no site principal.</p>
          <div class="profile-actions"><a class="btn" href="{E(site['mainSite'])}" target="_blank" rel="noopener noreferrer">Conhecer o estúdio <i>↗</i></a><a class="btn" href="{E(site['mainSite'])}/pages/sobre.html" target="_blank" rel="noopener noreferrer">A casa por trás do sistema <i>↗</i></a></div>
        </div>
      </div>
    </div></section>
  </main>'''
    return page_head(site, '', title='Time — Black Void', description=site['description'],
                     canonical=site['origin'] + '/', json_ld=json_ld) + '\n<body>\n' + _chrome_open(site, '', 'home') + main + _chrome_close(site)


def _chrome_open(site, css_prefix, current) -> str:
    nav = lambda key: ' aria-current="page"' if current == key else ''
    base = css_prefix or '.'
    return f'''  <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
  <header class="site-header"><div class="wrap">
    <a class="brand" href="{base}/"><b>BLACK VOID</b><i>/</i><span>TIME</span></a>
    <nav class="site-nav" aria-label="Navegação da plataforma">
      <a href="{base}/"{nav('home')}>Equipe</a>
      <a href="{css_prefix}arthur"{nav('arthur')}>Arthur</a>
      <a class="nav-ext" href="{E(site['mainSite'])}" target="_blank" rel="noopener noreferrer">blackvoid.dev</a>
    </nav>
  </div></header>
'''


def _chrome_close(site) -> str:
    return f'''
  <footer class="site-footer"><div class="wrap">
    <span class="meta">© 2026 Black Void Studio · Time</span>
    <span class="meta">{E(site['footerNote'])} · <a href="{E(site['mainSite'])}" target="_blank" rel="noopener noreferrer">www.blackvoid.dev</a></span>
  </div></footer>
</body>
</html>
'''


def profile_page(site, m) -> str:
    slug = m['slug']; pre = '../'
    knows = sorted({c[0] for c in m['capabilities']} | set(m['coordinates']))
    person = {
        '@context': 'https://schema.org', '@type': 'ProfilePage',
        'name': f"{m['name']} — Perfil profissional", 'url': f"{site['origin']}/{slug}",
        'isPartOf': {'@type': 'WebSite', 'name': site['name'], 'url': site['origin']},
        'mainEntity': {
            '@type': 'Person',
            'name': m['name'],
            'jobTitle': f"{m['role']} · {m['discipline']}",
            'description': ' '.join(m['bio']),
            'image': f"{site['origin']}/{m['photo']['src']}",
            'url': f"{site['origin']}/{slug}",
            'worksFor': {'@type': 'Organization', 'name': 'Black Void Studio', 'url': site['mainSite']},
            'address': {'@type': 'PostalAddress', 'addressLocality': 'Dourados', 'addressRegion': 'MS', 'addressCountry': 'BR'},
            'knowsAbout': knows,
            'sameAs': [m['links']['github']['url'], m['links']['linkedin']['url']],
        },
    }
    caps = '\n'.join(f'''        <article class="cap"><span class="cap__num">{i+1:02d}</span><h3>{E(t)}</h3><p>{E(items)}</p></article>'''
                     for i, (t, items) in enumerate(m['capabilities']))
    projects = '\n'.join(f'''        <article class="project">
          <span class="project__num">{i+1:02d}</span><span class="project__type">{E(p['type'])}</span>
          <h3>{E(p['name'])}</h3><p>{E(p['description'])}</p>
          <div class="project__stack">{''.join(f'<span>{E(s)}</span>' for s in p['stack'])}</div>
          {f'<a class="project__link" href="{E(p["link"])}" target="_blank" rel="noopener noreferrer">{E(p["linkLabel"])}</a>' if p.get('link') else ''}
        </article>''' for i, p in enumerate(m['projects']))
    points = '\n'.join(f'          <li><span>{i+1:02d}</span>{E(pt)}</li>' for i, pt in enumerate(m['experience']['points']))
    gallery = '\n'.join(f'''        <figure><img src="{pre}{E(g['src'])}" alt="{E(g['alt'])}" loading="lazy"><figcaption>{E(g['caption'])}</figcaption></figure>'''
                        for g in m['gallery'])
    L = m['links']
    contacts = [
        ('Email', L['email'], f"mailto:{L['email']}"),
        ('WhatsApp', L['whatsapp']['label'], L['whatsapp']['url']),
        ('GitHub', L['github']['label'], L['github']['url']),
        ('LinkedIn', L['linkedin']['label'], L['linkedin']['url']),
        ('Currículo', L['cv']['label'], f"{pre}{L['cv']['url']}"),
    ]
    contact_rows = '\n'.join(
        f'''        <a href="{E(href)}"{f' target="_blank" rel="noopener noreferrer"' if href.startswith('http') else ''}><span>{E(label)}</span><strong>{E(value)}</strong><i>↗</i></a>'''
        for label, value, href in contacts)
    bio = '\n'.join(f'          <p>{E(b)}</p>' for b in m['bio'])
    exp = m['experience']
    og_image = f"{site['origin']}/{m['photo']['src']}"
    main = f'''  <main id="conteudo">
    <section class="profile-hero"><div class="wrap">
      <div>
        <p class="kicker enter">Perfil / {E(slug)}</p>
        <h1 class="display enter enter--1">{E(m['name'].split()[0])}<br><em>{E(' '.join(m['name'].split()[1:]))}.</em></h1>
        <div class="profile-roles enter enter--2"><span>{E(m['role'])}</span><span>{E(m['discipline'])}</span></div>
        <p class="lead enter enter--2" style="font-size:16px">{E(m['headline'])}</p>
        <div class="profile-actions enter enter--3">
          <a class="btn btn--signal" href="mailto:{E(L['email'])}">Iniciar conversa <i>↗</i></a>
          <a class="btn" href="{pre}{E(L['cv']['url'])}" target="_blank" rel="noopener noreferrer">{E(L['cv']['label'])} <i>↗</i></a>
        </div>
        <div class="team-hero__meta enter enter--3" style="margin-top:26px"><span class="meta">{E(m['location'])}</span><span class="meta">{E(exp['company'])} desde {E(exp['start'])}</span></div>
      </div>
      <figure class="profile-photo enter enter--2">
        <div class="profile-photo__frame"><img src="{pre}{E(m['photo']['src'])}" alt="{E(m['photo']['alt'])}" width="{m['photo']['width']}" height="{m['photo']['height']}" fetchpriority="high"></div>
        <figcaption><span>Portrait / 2026</span><span>Human before system</span></figcaption>
      </figure>
    </div></section>

    <section class="block" aria-labelledby="t-sobre"><div class="wrap">
      <div class="section-index"><b>01</b><span id="t-sobre">Intent / Sobre</span></div>
      <div class="split">
        <div class="about-copy">
          <p class="kicker">Intenção antes da execução.</p>
          <h2 class="h-lg" id="t-sobre-title">Sistemas que pensam.<br>Produtos que <em>funcionam.</em></h2>
{bio}
          <div class="coordinates">{''.join(f'<span><b>{i+1:02d}</b> {E(c)}</span>' for i, c in enumerate(m['coordinates']))}</div>
        </div>
        <figure class="portrait-card">
          <img src="{pre}{E(m['portrait']['src'])}" alt="{E(m['portrait']['alt'])}" width="{m['portrait']['width']}" height="{m['portrait']['height']}" loading="lazy">
          <figcaption><span>Portrait / 2026</span><span>Human before system</span></figcaption>
        </figure>
      </div>
    </div></section>

    <section class="block" aria-labelledby="t-projetos"><div class="wrap">
      <div class="section-index"><b>02</b><span id="t-projetos">Systems / Projetos selecionados</span></div>
      <div class="project-grid">
{projects}
      </div>
    </div></section>

    <section class="block" aria-labelledby="t-stack"><div class="wrap">
      <div class="section-index"><b>03</b><span id="t-stack">Architecture / Especialidades</span></div>
      <div class="split split--narrow-right">
        <div>
          <p class="kicker">Capability map</p>
          <h2 class="h-lg">Do pixel<br>ao <em>processo.</em></h2>
          <p class="lead" style="font-size:16px;margin-top:18px">Uma arquitetura coerente, não uma coleção de ferramentas. Produto, interface, dados, agentes e infraestrutura tratados como partes do mesmo sistema.</p>
        </div>
        <div class="cap-list">
{caps}
        </div>
      </div>
    </div></section>

    <section class="block" aria-labelledby="t-exp"><div class="wrap">
      <div class="section-index"><b>04</b><span id="t-exp">Build / Experiência</span></div>
      <div class="exp-head">
        <h2 class="exp-role" id="t-exp-title">{E(exp['company'])}<em style="color:var(--signal-hi);font-style:italic">.</em></h2>
        <span class="exp-meta">{E(exp['role'])} · {E(exp['start'])} — {E(exp['end'])} · {E(exp['place'])}</span>
      </div>
      <p class="exp-lead">{E(exp['lead'])}</p>
      <ul class="exp-points">
{points}
      </ul>
      <div class="impact"><strong>{E(exp['impact']['value'])}</strong><p>{E(exp['impact']['text'])}</p></div>
    </div></section>

    <section class="block" aria-labelledby="t-cena"><div class="wrap">
      <div class="section-index"><b>05</b><span id="t-cena">Scene / Processo</span></div>
      <div class="gallery">
{gallery}
      </div>
    </div></section>

    <section class="block" aria-labelledby="t-contato"><div class="wrap">
      <div class="section-index"><b>06</b><span id="t-contato">Connect / Contato profissional</span></div>
      <div class="split split--narrow-right">
        <div>
          <p class="kicker">Connection available</p>
          <h2 class="h-lg">Vamos construir algo<br>com <em>propósito.</em></h2>
          <p class="lead" style="font-size:16px;margin-top:18px">Projetos, parcerias estratégicas e oportunidades onde tecnologia, design e inteligência artificial criam valor real.</p>
        </div>
        <div class="contact-list">
{contact_rows}
        </div>
      </div>
      <p class="contact-note">Canais profissionais confirmados pela própria pessoa retratada. Para propostas ao estúdio, use o <a href="{E(site['mainSite'])}/pages/contato.html" target="_blank" rel="noopener noreferrer" style="color:var(--signal-hi)">contato da Black Void ↗</a>.</p>
    </div></section>
  </main>'''
    title = f"{m['name']} — {m['role']} | Time Black Void"
    desc = f"{m['name']}: {m['role']} e {m['discipline']} na Black Void. {m['headline']} {m['location']}."
    return page_head(site, pre, title=title, description=desc, canonical=f"{site['origin']}/{slug}",
                     og_type='profile', og_image=og_image, json_ld=person) + f'\n<body itemscope itemtype="https://schema.org/ProfilePage">\n' + _chrome_open(site, pre, slug) + main + _chrome_close(site)


def notfound_page(site) -> str:
    main = '''  <main id="conteudo" class="notfound"><div class="wrap">
    <p class="kicker">404 / Arquivo não encontrado</p>
    <h1 class="display">Este perfil<br>ainda não <em>existe.</em></h1>
    <p class="lead">O caminho que você procurou não está no arquivo da equipe. Pode ser um perfil ainda não publicado — ou um endereço que nunca existiu.</p>
    <div class="profile-actions" style="margin-top:30px"><a class="btn btn--signal" href="/">Ver a equipe <i>↗</i></a></div>
  </div></main>'''
    return page_head(site, '', title='404 — Time Black Void', description='Perfil não encontrado na plataforma da equipe Black Void.',
                     canonical=None, robots='noindex') + '\n<body>\n' + _chrome_open(site, '', '') + main + _chrome_close(site)


def write_sitemap(site, members) -> None:
    entries = [(site['origin'] + '/', 'time/index.html')]
    for m in members:
        entries.append((f"{site['origin']}/{m['slug']}", f"time/{m['slug']}/index.html"))
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, rel in entries:
        lines += ['  <url>', f'    <loc>{loc}</loc>', f'    <lastmod>{lastmod_for(rel)}</lastmod>', '  </url>']
    lines.append('</urlset>')
    xml = '\n'.join(lines) + '\n'
    minidom.parseString(xml)
    (ROOT / 'sitemap.xml').write_text(xml, encoding='utf-8')


def main() -> None:
    data = json.loads(DATA.read_text(encoding='utf-8'))
    validate(data)
    site, members = data['site'], data['members']

    for src, rel in ASSETS.items():
        if not src.exists():
            sys.exit(f'ERRO: fonte de asset ausente: {src}')
        dest = ROOT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dest)

    (ROOT / 'index.html').write_text(home_page(site, members), encoding='utf-8')
    for m in members:
        d = ROOT / m['slug']
        d.mkdir(exist_ok=True)
        (d / 'index.html').write_text(profile_page(site, m), encoding='utf-8')
    (ROOT / '404.html').write_text(notfound_page(site), encoding='utf-8')
    (ROOT / 'robots.txt').write_text(
        '# robots.txt — time.blackvoid.dev\nUser-agent: *\nAllow: /\n\nSitemap: https://time.blackvoid.dev/sitemap.xml\n',
        encoding='utf-8')
    write_sitemap(site, members)

    print('time.blackvoid.dev gerado:')
    print('  index.html')
    for m in members:
        print(f"  {m['slug']}/index.html")
    print('  404.html, robots.txt, sitemap.xml, assets/ (copiados)')


if __name__ == '__main__':
    main()
