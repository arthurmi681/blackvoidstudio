# Time — Black Void (`time.blackvoid.dev`)

Plataforma pública da equipe Black Void Studio. Site **estático, sem framework e
sem dependências de build** — o diretório `time/` é a raiz de um projeto Vercel
próprio (segundo projeto no mesmo repositório), servido em
`https://time.blackvoid.dev`.

## Arquitetura

```
time/
├── build.py            # gerador (Python 3, só stdlib): dados → páginas
├── data/members.json   # fonte única de verdade (por que existe: adicionar
│                       #   pessoa = 1 objeto JSON + 1 execução do build)
├── assets/css/time.css # design system da plataforma
├── assets/{fonts,img,docs}/  # gerados pelo build (copiados das fontes únicas
│                             #   do repo: equipe/arthur/* e pages/assets/img)
├── index.html          # gerado — home da equipe (/)
├── {slug}/index.html   # gerado — um por membro (/{slug})
├── 404.html            # gerado — fallback servido automaticamente pela Vercel
├── sitemap.xml         # gerado — somente URLs de time.blackvoid.dev
├── robots.txt          # gerado — declara o sitemap do subdomínio
└── vercel.json         # headers de segurança/cache + URL sem barra final
```

Decisão: **estático suficiente para a v1.** Não há edição por usuários, login
ou conteúdo transacional; páginas pré-renderizadas dão máxima performance,
SEO previsível e zero superfície de ataque. Caminho de evolução (só quando
houver necessidade real, ex.: muitos membros editando o próprio perfil):
migrar `members.json` para um CMS/Supabase mantendo o mesmo gerador como
camada de render.

## Uso

```bash
python3 time/build.py          # gera/atualiza tudo a partir de members.json
python3 -m http.server -d time # preview local em http://localhost:8000
```

Adicionar um membro: criar objeto em `members[]` (campos obrigatórios:
`slug` [a-z0-9-], `name`, `role`, `location`, `headline`, `bio`, `photo`,
`links`), rodar `build.py`, revisar os HTMLs gerados e commitar tudo.

Regras de conteúdo: dados pessoais **só com confirmação da própria pessoa**;
canais de contato públicos e profissionais; nada de formulários nem cadastro.

## Publicação (quando autorizada — ainda não executado)

1. No painel Vercel: **Add New → Project** apontando para este mesmo
   repositório, com **Root Directory = `time`**, Framework Preset = **Other**
   (sem build command — os arquivos já vêm commitados; ou, se preferir gerar
   no CI: Build Command `python3 build.py` com Output Directory `.`).
2. Em **Settings → Domains** desse novo projeto: adicionar `time.blackvoid.dev`.
3. DNS: registro `CNAME time → cname.vercel-dns.com` (onde o DNS de
   blackvoid.dev está hospedado).
4. Não tocar nos domínios do projeto principal (`blackvoid.dev` / `www…`) —
   são projetos independentes, com sitemap/robots próprios por origem.

O site principal (`home.html` + `pages/`, projeto Vercel atual) **não recebe
nenhuma alteração**: origens distintas não conflitam.
