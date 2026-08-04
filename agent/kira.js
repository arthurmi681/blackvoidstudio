/*!
 * ██╗  ██╗██╗██████╗  █████╗
 * ██║ ██╔╝██║██╔══██╗██╔══██╗
 * █████╔╝ ██║██████╔╝███████║
 * ██╔═██╗ ██║██╔══██╗██╔══██║
 * ██║  ██╗██║██║  ██║██║  ██║
 * ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
 *
 * KIRA — Assistente de IA da Black Void Studio
 * Script único, autônomo, autoinjetado.
 */
(function () {
  'use strict';

  if (window.__KIRA_LOADED__) return;
  window.__KIRA_LOADED__ = true;

  /* ======================================================================
     1. CONFIG
     ====================================================================== */

  var USER_CONFIG = window.KIRA_CONFIG || {};

  var CONFIG = deepMerge(
    {
      name: 'Kira',
      role: 'Assistente de IA — Black Void Studio',
      position: 'bottom-right',
      greetOnFirstOpen: true,
      persistHistory: false, // DESATIVADO — chat reseta ao fechar o site
      storageKey: 'kira_history_v1',
      seenKey: 'kira_seen_v1',
      typingDelay: { min: 450, max: 1400 },
      suggestions: [
        'Quanto custa um site?',
        'Vocês fazem soluções com IA?',
        'Quero um orçamento personalizado',
      ],
      contact: {
        whatsapp: 'https://wa.me/5511999999999',
        email: 'contato@blackvoidstudio.dev',
        instagram: '',
        linkedin: '',
      },
      llm: {
        enabled: true,
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        maxTokens: 420,
      },
    },
    USER_CONFIG
  );

  function deepMerge(base, override) {
    var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    for (var k in override) {
      if (!Object.prototype.hasOwnProperty.call(override, k)) continue;
      var v = override[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object') {
        out[k] = deepMerge(base[k], v);
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  /* ======================================================================
     2. BASE DE CONHECIMENTO
     ====================================================================== */

  var KB = [
    {
      id: 'about_what',
      phrases: ['o que e a black void', 'quem e a black void', 'sobre a black void', 'sobre voces', 'sobre a empresa', 'quem sao voces', 'o que voces fazem'],
      words: ['blackvoid'],
      answer:
        'A **Black Void Studio** é um estúdio de tecnologia focado em transformar ideias em produtos digitais de verdade: sites, sistemas, automações e Inteligência Artificial, tudo desenhado para gerar resultado, não só para "existir bonito".\n\nTrabalhamos a stack inteira — design, código, infraestrutura e segurança — em vez de terceirizar pedaços do seu projeto para fornecedores diferentes.',
    },
    {
      id: 'about_origin',
      phrases: ['como surgiu a empresa', 'historia da black void', 'como comecou a black void'],
      answer:
        'A Black Void nasceu da necessidade de juntar, num único lugar, o que normalmente fica espalhado entre freelancers: design, desenvolvimento, infraestrutura, segurança e IA. Em vez de contratar cinco fornecedores diferentes, você trabalha com um time que entende o projeto do início ao fim.',
    },
    {
      id: 'about_mission',
      phrases: ['qual e a missao', 'missao da black void', 'proposito da empresa'],
      answer:
        'Nossa missão é simples: **entregar tecnologia que funciona de verdade** — rápida, segura e escalável — para empresas que não querem só um site bonito, mas uma ferramenta que realmente traz clientes e organiza operação.',
    },
    {
      id: 'about_values',
      phrases: ['quais sao os valores', 'valores da black void', 'principios da empresa'],
      answer:
        'Trabalhamos em cima de alguns princípios não-negociáveis:\n- Design + código + conversão sempre juntos\n- Segurança em primeiro lugar, não como afterthought\n- Automação e eficiência acima de trabalho manual repetitivo\n- Honestidade técnica: se algo não faz sentido pro seu negócio, a gente fala',
    },
    {
      id: 'about_founder',
      phrases: ['quem fundou a empresa', 'quem e o fundador', 'quem criou a black void', 'dono da black void'],
      answer:
        'A Black Void Studio foi fundada por **Zaki**, desenvolvedor full stack e founder hands-on — ou seja, ele mesmo arquiteta e constroi os projetos, não só gerencia. Isso garante que o que é vendido é exatamente o que é entregue.',
    },
    {
      id: 'about_location',
      phrases: ['a empresa e brasileira', 'onde fica a black void', 'empresa internacional', 'onde voces estao localizados'],
      answer:
        'Somos uma empresa **brasileira**, sediada em Dourados, MS — mas atendemos clientes remotamente em qualquer lugar do Brasil (e fora dele). Todo o fluxo de trabalho já é 100% remoto por padrão.',
    },
    {
      id: 'about_why',
      phrases: ['por que escolher a black void', 'quais diferenciais voces tem', 'diferencial da black void', 'por que voces e nao outra empresa'],
      answer:
        'Três motivos práticos:\n- **Um time só, do início ao fim** — sem repasse de responsabilidade entre fornecedores\n- **Documentação de verdade** — cada entrega segue um padrão de engenharia próprio, não é "só o código"\n- **Visão de negócio, não só de código** — sugerimos o que vai gerar resultado, mesmo que não tenha sido pedido',
    },
    {
      id: 'about_size',
      phrases: ['atendem empresas de qualquer tamanho', 'atendem pequenas empresas', 'atendem grandes empresas'],
      answer:
        'Sim. Atendemos desde autônomos e pequenos negócios que precisam de uma presença online sólida, até empresas maiores que precisam de sistemas, IA e infraestrutura robusta. O que muda é o escopo, não a qualidade da entrega.',
    },
    {
      id: 'about_countries',
      phrases: ['em quais paises atendem', 'atendem fora do brasil', 'trabalham internacionalmente'],
      answer:
        'Como o trabalho é 100% remoto, atendemos clientes no Brasil e também internacionalmente. Fuso horário e idioma são só detalhes de alinhamento — nunca foram um problema.',
    },
    {
      id: 'sites_price',
      phrases: ['quanto custa um site institucional', 'preco do site institucional', 'valor do site institucional'],
      answer:
        '**Site Institucional** — a partir de **R$ 1.497**\n\nInclui: até 5 páginas, domínio, hospedagem, SSL, SEO básico, formulário de contato, integração com WhatsApp, responsividade total e suporte inicial pós-entrega.',
    },
    {
      id: 'sites_landing_price',
      phrases: ['quanto custa uma landing page', 'preco da landing page', 'valor da landing page'],
      answer: '**Landing Page** — a partir de **R$ 897**, com foco total em conversão: uma página, um objetivo, sem distração.',
    },
    {
      id: 'sites_ecommerce_price',
      phrases: ['quanto custa uma loja virtual', 'preco do ecommerce', 'valor da loja virtual', 'preco loja online'],
      answer: '**Loja Virtual** — a partir de **R$ 2.990**, com catálogo, carrinho, checkout e integração de pagamento configurados do zero.',
    },
    {
      id: 'sites_generic_price',
      phrases: ['quanto custa um site', 'preco de site', 'valor de um site', 'quanto voces cobram', 'quanto fica fazer um site', 'qual o investimento', 'quero saber o preco'],
      words: ['preco', 'orcamento', 'custa', 'valor', 'investimento'],
      answer:
        'Depende do tipo de projeto:\n- **Landing Page** — a partir de R$ 897\n- **Site Institucional** — a partir de R$ 1.497\n- **Loja Virtual** — a partir de R$ 2.990\n- **Sistemas, IA, automações e infraestrutura** — orçamento personalizado, conforme escopo\n\nMe conta que tipo de projeto você tem em mente que eu já te dou um número mais preciso.',
    },
    {
      id: 'sites_time',
      phrases: [
        'quanto tempo leva um site', 'prazo do site', 'prazo de entrega do site', 'tempo de entrega',
        'prazo da loja virtual', 'prazo loja virtual', 'prazo do site institucional', 'prazo site institucional',
        'prazo da landing page', 'prazo landing page', 'prazo do sistema', 'prazo sistema web',
        'quanto tempo demora', 'quanto tempo demora um site', 'em quanto tempo fica pronto',
      ],
      words: ['prazo'],
      answer:
        'Prazos médios:\n- **Landing Page** — 3 a 7 dias\n- **Site Institucional** — 7 a 15 dias\n- **Loja Virtual** — 15 a 30 dias\n- **Sistema Web** — conforme escopo do projeto\n\nVocê acompanha cada etapa, nada de "sumir 3 semanas e aparecer com o link pronto".',
    },
    {
      id: 'sites_included',
      phrases: ['o que esta incluso', 'o que vem no site', 'o que esta incluido no pacote'],
      answer:
        'Todo projeto de site sai pronto pra rodar em produção: domínio, hospedagem, SSL, SEO básico, formulário de contato, integração com WhatsApp, responsividade completa e suporte inicial. Nada de "site pronto" que depende de você configurar mais dez coisas depois.',
    },
    {
      id: 'sites_responsive',
      phrases: ['o site e responsivo', 'funciona em celular', 'funciona no mobile'],
      answer: 'Sim, 100% responsivo por padrão — testado em desktop, tablet e celular antes da entrega. Isso não é um "extra", é parte do processo desde o design.',
    },
    {
      id: 'sites_landing',
      phrases: ['voces fazem landing pages', 'fazem landing page'],
      answer: 'Fazemos. Landing pages são construídas com foco em um único objetivo (venda, captação de lead, evento) e otimizadas pra conversão, não só pra estética.',
    },
    {
      id: 'sites_ecommerce',
      phrases: ['fazem ecommerce', 'fazem loja virtual', 'fazem loja online'],
      answer: 'Sim, desenvolvemos lojas virtuais completas — catálogo, carrinho, checkout, integração de pagamento e painel de gestão dos pedidos.',
    },
    {
      id: 'sites_portfolio_type',
      phrases: ['fazem portfolio', 'fazem site de portfolio'],
      answer: 'Fazemos sites de portfólio para profissionais e marcas que precisam mostrar trabalho de forma visualmente forte — com foco em identidade, não em template genérico.',
    },
    {
      id: 'sites_blog',
      phrases: ['fazem blog', 'fazem blogs'],
      answer: 'Sim, incluindo estrutura otimizada para SEO e um painel simples pra você publicar conteúdo sem depender de nós pra cada post.',
    },
    {
      id: 'sites_edit_later',
      phrases: ['posso editar depois', 'consigo editar o site depois', 'da pra mexer no site sozinho'],
      answer: 'Sim. Dependendo do projeto, você recebe um painel administrativo simples ou o próprio código-fonte — em ambos os casos, você não fica refém da gente pra mudanças básicas.',
    },
    {
      id: 'sites_seo',
      phrases: ['o site e otimizado para seo', 'tem seo', 'trabalham com seo'],
      words: ['seo'],
      answer:
        'Todo projeto sai com boas práticas de SEO desde a estrutura (HTML semântico, performance, meta tags, sitemap) — isso já vem incluso no pacote básico. Para estratégias de SEO mais avançadas (conteúdo, autoridade, keywords), fazemos consultoria à parte.',
    },
    {
      id: 'sites_domain_hosting',
      phrases: ['o dominio esta incluso', 'a hospedagem esta inclusa', 'preciso pagar dominio', 'posso usar minha hospedagem', 'posso usar meu dominio'],
      answer:
        'Domínio e hospedagem já vêm inclusos no plano de Site Institucional. Se você já tiver domínio ou hospedagem próprios, sem problema — a gente configura tudo em cima do que você já paga, sem custo extra.',
    },
    {
      id: 'sites_ssl',
      phrases: ['tem ssl', 'certificado ssl'],
      answer: 'Sim, todo site sai com certificado SSL configurado — cadeado verde, conexão segura e melhor posicionamento no Google, que penaliza sites sem HTTPS.',
    },
    {
      id: 'sites_form',
      phrases: ['tem formulario', 'formulario de contato'],
      answer: 'Sim, formulário de contato integrado já vem no pacote padrão, com notificação por e-mail (e WhatsApp, se você quiser).',
    },
    {
      id: 'sites_whatsapp',
      phrases: ['tem integracao com whatsapp', 'integra com whatsapp'],
      answer: 'Sim, integração com WhatsApp (botão flutuante ou API oficial, dependendo da necessidade) já é padrão nos projetos de site.',
    },
    {
      id: 'sites_social',
      phrases: ['tem integracao com redes sociais', 'integra com instagram', 'integra com redes sociais'],
      answer: 'Sim, integramos feed de redes sociais, botões de compartilhamento e links diretos conforme a necessidade do projeto.',
    },
    {
      id: 'sites_admin_panel',
      phrases: ['tem painel administrativo', 'tem painel admin', 'tem cms'],
      answer: 'Para sites que precisam de conteúdo dinâmico (blog, portfólio, catálogo), sim — entregamos um painel administrativo simples pra você gerenciar sem depender de código.',
    },
    {
      id: 'sites_choose_design',
      phrases: ['posso escolher o design', 'consigo personalizar o design'],
      answer: 'Sim, o design é construído em cima da sua marca e das suas referências — não usamos template genérico. Você aprova o direcionamento visual antes de irmos pro código.',
    },
    {
      id: 'sites_exclusive',
      phrases: ['o site e exclusivo', 'o design e exclusivo', 'e um template'],
      answer: 'Todo projeto é construído do zero, sem template pronto revendido. O código e o design são exclusivos do seu negócio.',
    },
    {
      id: 'sites_systems',
      phrases: ['fazem sistemas web', 'fazem sistema web'],
      answer: 'Sim, além de sites institucionais desenvolvemos sistemas web completos — sob orçamento personalizado, já que o escopo varia bastante de projeto pra projeto.',
    },
    {
      id: 'ai_what',
      phrases: ['o que voces desenvolvem com ia', 'o que fazem com inteligencia artificial'],
      words: ['ia', 'inteligencia artificial'],
      answer:
        'Desenvolvemos: chatbots e assistentes inteligentes (como eu, aliás), automação de atendimento, agentes de IA que executam tarefas, integração de IA com sistemas já existentes e IA personalizada treinada com os documentos e dados do seu negócio.',
    },
    {
      id: 'ai_chatbot',
      phrases: ['criam chatbots', 'fazem chatbot', 'quero um chatbot', 'preciso de um chatbot'],
      answer: 'Sim, criamos chatbots sob medida — desde um assistente simples de FAQ até um agente que consulta seus sistemas e resolve tarefas reais, não só responde perguntas.',
    },
    {
      id: 'ai_assistant',
      phrases: ['criam assistentes inteligentes', 'fazem assistente de ia', 'preciso de uma ia'],
      answer: 'Sim. É exatamente o que eu sou — um assistente construído sob medida pra Black Void. Fazemos a mesma coisa pro seu negócio, com a sua base de conhecimento e sua identidade.',
    },
    {
      id: 'ai_integrate_system',
      phrases: ['integram ia ao meu sistema', 'colocar ia no meu sistema', 'integrar ia com meu software'],
      answer: 'Sim, integramos IA em sistemas já existentes — seja pra automatizar atendimento, gerar relatórios, classificar dados ou tomar decisões assistidas.',
    },
    {
      id: 'ai_automate_support',
      phrases: ['automatizam atendimento', 'quero automatizar meu atendimento', 'automatizar suporte'],
      answer: 'Sim, automatizamos atendimento de ponta a ponta: triagem inicial, respostas frequentes, qualificação de lead e escalonamento pra um humano só quando realmente necessário.',
    },
    {
      id: 'ai_agents',
      phrases: ['fazem agentes de ia', 'agente de ia', 'ia autonoma'],
      answer: 'Sim, desenvolvemos agentes de IA capazes de executar tarefas de forma autônoma — desde processar documentos até controlar fluxos inteiros entre sistemas diferentes.',
    },
    {
      id: 'ai_documents',
      phrases: ['a ia pode usar documentos', 'ia le documentos', 'ia baseada em documentos'],
      answer: 'Sim, treinamos a IA em cima dos seus próprios documentos e materiais — políticas internas, catálogo de produtos, contratos — pra ela responder com precisão sobre o seu negócio específico.',
    },
    {
      id: 'ai_learn_data',
      phrases: ['a ia aprende com meus dados', 'ia treinada com meus dados'],
      answer: 'Sim, é possível construir uma base de conhecimento personalizada em cima dos seus dados, mantendo tudo privado e sob seu controle.',
    },
    {
      id: 'ai_integration_channels',
      phrases: ['a ia integra com whatsapp', 'integra com telegram', 'integra com email', 'integra com crm'],
      words: ['telegram'],
      answer: 'Sim, integramos IA com WhatsApp, Telegram, e-mail, CRM e praticamente qualquer canal que tenha API disponível.',
    },
    {
      id: 'ai_providers',
      phrases: ['faz integracao com openai', 'faz integracao com claude', 'faz integracao com gemini', 'trabalham com qual ia'],
      answer: 'Trabalhamos com os principais provedores do mercado — OpenAI, Anthropic (Claude), Google (Gemini) e modelos open-source — escolhendo o mais adequado ao custo e à necessidade real do seu projeto.',
    },
    {
      id: 'ai_custom',
      phrases: ['e possivel criar uma ia personalizada', 'quero uma ia personalizada', 'ia sob medida'],
      answer: 'Totalmente possível — desde a personalidade e o tom de voz até a base de conhecimento e as integrações. Foi assim que eu fui construída, aliás.',
    },
    {
      id: 'auto_what',
      phrases: ['o que voces automatizam', 'o que e possivel automatizar'],
      answer:
        'Automatizamos praticamente qualquer processo repetitivo: planilhas, envio de e-mails, geração de propostas, fluxos de vendas, atendimento, processos internos, emissão de documentos e relatórios.',
    },
    { id: 'auto_sheets', phrases: ['automatizam planilhas', 'automatizar planilha'], answer: 'Sim, automatizamos atualização, cruzamento e geração de planilhas — eliminando trabalho manual repetitivo.' },
    { id: 'auto_email', phrases: ['automatizam envio de emails', 'automatizar email'], answer: 'Sim, desde disparos automáticos até fluxos condicionais baseados em comportamento do usuário.' },
    { id: 'auto_proposals', phrases: ['automatizam propostas', 'gerar propostas automaticamente'], answer: 'Sim, criamos sistemas que geram propostas comerciais automaticamente a partir de poucos dados de entrada.' },
    { id: 'auto_sales', phrases: ['automatizam vendas', 'automatizar processo de vendas'], answer: 'Sim, automatizamos etapas do funil de vendas — qualificação, follow-up e até fechamento de casos simples.' },
    { id: 'auto_internal', phrases: ['automatizam processos internos', 'automatizar processo interno'], answer: 'Sim, mapeamos processos internos manuais e construímos automações que eliminam retrabalho e erro humano.' },
    { id: 'auto_docs', phrases: ['automatizam emissao de documentos', 'gerar documentos automaticamente'], answer: 'Sim, geração automática de contratos, notas, relatórios e outros documentos a partir de templates dinâmicos.' },
    { id: 'auto_reports', phrases: ['automatizam relatorios', 'relatorios automaticos'], answer: 'Sim, relatórios gerados e enviados automaticamente, com os dados sempre atualizados — sem ninguém precisar montar planilha manualmente.' },
    {
      id: 'systems_custom',
      phrases: ['desenvolvem sistemas personalizados', 'fazem sistemas?', 'criam software', 'desenvolvem um sistema para minha empresa', 'fazem sistemas internos'],
      words: ['sistema', 'software'],
      answer:
        'Sim, desenvolvemos sistemas sob medida: ERP, CRM, controle de estoque, financeiro, sistemas para clínicas, restaurantes, escolas e logística, dashboards, painéis administrativos, APIs e integrações entre plataformas.',
    },
    { id: 'systems_erp', phrases: ['fazem erp', 'sistema erp'], answer: 'Sim, desenvolvemos ERPs sob medida, focados exatamente nos processos do seu negócio — sem pagar por módulo genérico que você nunca vai usar.' },
    { id: 'systems_crm', phrases: ['fazem crm', 'sistema crm'], answer: 'Sim, CRMs personalizados pra gestão de leads, funil de vendas e relacionamento com cliente, integrados com WhatsApp e e-mail se necessário.' },
    { id: 'systems_stock', phrases: ['sistema de estoque', 'controle de estoque'], answer: 'Sim, sistemas de controle de estoque com alertas automáticos, relatórios e integração com vendas.' },
    { id: 'systems_finance', phrases: ['sistema financeiro'], answer: 'Sim, sistemas financeiros para fluxo de caixa, contas a pagar/receber e relatórios gerenciais.' },
    { id: 'systems_clinic', phrases: ['sistema para clinicas', 'sistema para clinica'], answer: 'Sim, sistemas de agendamento, prontuário e gestão para clínicas e consultórios.' },
    { id: 'systems_restaurant', phrases: ['sistema para restaurantes', 'sistema para restaurante'], answer: 'Sim, sistemas de pedidos, comanda digital e gestão para restaurantes e delivery.' },
    { id: 'systems_school', phrases: ['sistema escolar'], answer: 'Sim, sistemas de gestão escolar — matrícula, notas, frequência e comunicação com responsáveis.' },
    { id: 'systems_logistics', phrases: ['sistema para logistica'], answer: 'Sim, sistemas de gestão logística, rastreamento de entregas e otimização de rotas.' },
    { id: 'systems_dashboard', phrases: ['fazem dashboards', 'dashboard'], answer: 'Sim, dashboards com dados em tempo real, do jeito que faz sentido pra decisão do seu negócio — não gráfico bonito sem função.' },
    { id: 'systems_admin_panels', phrases: ['paineis administrativos'], answer: 'Sim, painéis administrativos sob medida pra gestão de conteúdo, usuários, pedidos ou o que o seu sistema precisar controlar.' },
    { id: 'systems_apis', phrases: ['fazem apis', 'trabalham com apis', 'criam api'], words: ['api', 'apis'], answer: 'Sim, desenvolvemos e integramos APIs — tanto criando as suas próprias quanto conectando com serviços de terceiros.' },
    { id: 'systems_integrations', phrases: ['fazem integracoes', 'integracoes entre sistemas'], answer: 'Sim, integrações entre sistemas diferentes fazem parte do dia a dia — de ERPs a plataformas de pagamento e marketing.' },
    { id: 'systems_migration', phrases: ['fazem migracao de sistemas', 'migrar sistema antigo'], answer: 'Sim, migramos sistemas legados para stacks modernas, com plano de transição que evita downtime e perda de dados.' },
    { id: 'systems_maintenance', phrases: ['fazem manutencao em sistemas existentes', 'manutencao de sistema'], answer: 'Sim, damos manutenção em sistemas que não desenvolvemos originalmente — desde que o código seja auditável.' },
    {
      id: 'infra_general',
      phrases: ['oferecem hospedagem', 'configuram servidores', 'trabalham com infraestrutura'],
      words: ['infraestrutura', 'servidor', 'servidores'],
      answer:
        'Sim, cuidamos de toda a infraestrutura: hospedagem, configuração de servidores, VPS, cloud, backup automatizado, monitoramento, CDN, SSL, banco de dados, Docker e ambientes Linux.',
    },
    { id: 'infra_vps', phrases: ['trabalham com vps'], answer: 'Sim, configuramos e gerenciamos VPS conforme a necessidade de performance e orçamento do projeto.' },
    { id: 'infra_cloud', phrases: ['trabalham com cloud', 'infraestrutura em nuvem'], answer: 'Sim, arquitetura em nuvem (AWS, GCP, Azure ou provedores nacionais) conforme o que fizer mais sentido pro seu caso.' },
    { id: 'infra_backup', phrases: ['fazem backup', 'tem backup automatico'], answer: 'Sim, backup automatizado é padrão em qualquer infraestrutura que configuramos — seu dado nunca fica dependendo de "esquecimento zero".' },
    { id: 'infra_monitoring', phrases: ['fazem monitoramento', 'monitoramento de servidor'], answer: 'Sim, monitoramento contínuo de uptime, performance e alertas automáticos em caso de anomalia.' },
    { id: 'infra_cdn', phrases: ['tem cdn'], answer: 'Sim, configuramos CDN quando o projeto precisa de performance global ou lida com tráfego de imagens/vídeo pesado.' },
    { id: 'infra_database', phrases: ['trabalham com bancos de dados', 'banco de dados'], answer: 'Sim, trabalhamos com PostgreSQL, MongoDB, MySQL/SQLite e outras opções, escolhendo conforme o tipo de dado e escala do projeto.' },
    { id: 'infra_docker', phrases: ['trabalham com docker'], answer: 'Sim, containerizamos aplicações com Docker sempre que isso facilita deploy, escala e manutenção.' },
    { id: 'infra_linux', phrases: ['trabalham com linux'], answer: 'Sim, nossa infraestrutura roda majoritariamente em Linux — mais estável, mais seguro e mais barato pra escalar.' },
    {
      id: 'security_general',
      phrases: ['fazem ciberseguranca', 'seguranca digital', 'consultoria de seguranca'],
      words: ['seguranca', 'ciberseguranca'],
      answer:
        'Sim, atuamos em cibersegurança de ponta a ponta: auditoria, pentest, hardening de servidores, configuração de firewall, backup, proteção contra ataques, monitoramento contínuo e consultoria técnica.',
    },
    { id: 'security_audit', phrases: ['fazem auditoria de seguranca', 'auditoria'], answer: 'Sim, fazemos auditoria de segurança completa — identificando vulnerabilidades antes que alguém mal-intencionado encontre primeiro.' },
    { id: 'security_pentest', phrases: ['fazem pentest', 'teste de invasao'], answer: 'Sim, realizamos pentest (teste de invasão controlado) pra validar a resistência real dos seus sistemas.' },
    { id: 'security_hardening', phrases: ['fazem hardening'], answer: 'Sim, hardening de servidores e aplicações — fechando brechas de configuração que a maioria ignora.' },
    { id: 'security_firewall', phrases: ['configuram firewall'], answer: 'Sim, configuração de firewall e regras de rede sob medida pra sua infraestrutura.' },
    { id: 'security_attacks', phrases: ['protecao contra ataques', 'protecao ddos'], answer: 'Sim, implementamos proteção contra ataques comuns (DDoS, brute force, injeção) como parte padrão da infraestrutura.' },
    {
      id: 'marketing_general',
      phrases: ['fazem marketing', 'trabalham com marketing digital'],
      answer: 'Atuamos no lado técnico do marketing digital: SEO, landing pages de alta conversão, performance, Google Analytics e Pixel do Meta configurados corretamente.',
    },
    { id: 'marketing_conversion', phrases: ['otimizacao de conversao', 'aumentar conversao'], answer: 'Sim, otimização de conversão é parte do DNA de todo projeto — não faz sentido ter tráfego sem transformar isso em resultado.' },
    { id: 'marketing_analytics', phrases: ['configuram google analytics', 'configuram pixel meta'], answer: 'Sim, configuramos Google Analytics e Pixel do Meta corretamente desde o início — muita gente perde meses de dados por isso não ser feito no dia 1.' },
    {
      id: 'pricing_overview',
      phrases: ['tabela de precos', 'quais os precos', 'valores dos servicos', 'quero ver os precos'],
      answer:
        'Visão geral:\n- **Landing Page** — a partir de R$ 897\n- **Site Institucional** — a partir de R$ 1.497\n- **Loja Virtual** — a partir de R$ 2.990\n- **Sistema Web, IA, Automações e Infraestrutura** — orçamento personalizado\n\nQuer que eu detalhe algum desses?',
    },
    {
      id: 'pricing_ia',
      phrases: ['quanto custa uma ia', 'preco da ia', 'valor de um chatbot'],
      answer: 'Soluções de IA (chatbots, agentes, automação de atendimento) são sempre **orçamento personalizado** — o custo depende de complexidade, integrações e volume de uso.',
    },
    {
      id: 'pricing_automation',
      phrases: ['quanto custa uma automacao', 'preco de automacao'],
      answer: 'Automações também são **orçamento personalizado**, calculado em cima do processo que será automatizado e das integrações necessárias.',
    },
    {
      id: 'pricing_infra',
      phrases: ['quanto custa infraestrutura', 'preco de infraestrutura', 'preco de servidor'],
      answer: 'Infraestrutura é **orçamento personalizado**, variando conforme volume de tráfego, redundância e nível de segurança exigido.',
    },
    {
      id: 'pricing_system',
      phrases: ['quanto custa um sistema', 'preco de sistema web', 'valor de um sistema'],
      answer: 'Sistemas web são sempre **orçamento personalizado** — o escopo varia demais entre um CRM simples e um ERP completo pra dar um número fixo.',
    },
    {
      id: 'timeline_overview',
      phrases: ['qual o prazo geral', 'prazos de entrega'],
      answer: 'Landing Page: 3–7 dias · Site Institucional: 7–15 dias · Loja Virtual: 15–30 dias · Sistema Web: conforme escopo do projeto.',
    },
    {
      id: 'payment',
      phrases: ['formas de pagamento', 'como funciona o pagamento', 'posso parcelar', 'aceita pix', 'aceita cartao'],
      words: ['pagamento', 'parcelar', 'pix'],
      answer:
        'Aceitamos PIX, cartão (com parcelamento) e o modelo mais comum: **entrada + restante na entrega**. Trabalhamos com contrato formal e emitimos nota fiscal quando aplicável — tudo documentado, nada informal.',
    },
    {
      id: 'support',
      phrases: ['fazem suporte', 'tem suporte tecnico', 'fazem manutencao', 'fazem atualizacoes', 'fazem treinamento'],
      words: ['suporte', 'manutencao'],
      answer: 'Sim, oferecemos suporte pós-entrega: atualizações, correções, manutenção contínua, suporte técnico e treinamento pra sua equipe usar o que foi entregue sem depender da gente pra tudo.',
    },
    {
      id: 'support_revisions',
      phrases: ['quantas revisoes estao inclusas', 'posso pedir alteracoes'],
      answer: 'Cada proposta já deixa claro quantas rodadas de revisão estão inclusas — normalmente o suficiente pra alinhar tudo sem virar um ciclo infinito de mudanças. Ajustes fora do escopo são orçados à parte.',
    },
    {
      id: 'contract',
      phrases: ['fazem contrato', 'tem contrato formal'],
      answer: 'Sim, todo projeto é formalizado com contrato — protege você e protege a gente. Nada de "combinado só no WhatsApp".',
    },
    {
      id: 'code_ownership',
      phrases: ['o codigo e meu', 'voces entregam o codigo fonte', 'o codigo fonte e meu'],
      answer: 'Sim, o código-fonte é seu. Entregamos tudo documentado ao final do projeto — você não fica refém da gente pra manter ou evoluir o que foi construído.',
    },
    {
      id: 'project_custom',
      phrases: ['o projeto e personalizado', 'e feito sob medida'],
      answer: 'Sim, cada projeto é construído do zero em cima do seu negócio específico — sem template genérico revendido pra vários clientes.',
    },
    {
      id: 'remote_work',
      phrases: ['trabalham remotamente', 'atendem minha cidade', 'atendem qualquer lugar'],
      answer: 'Sim, todo o processo é remoto — reuniões por chamada, alinhamento por WhatsApp/e-mail e entregas pela nuvem. Sua cidade não é uma limitação.',
    },
    {
      id: 'free_quote',
      phrases: ['o orcamento e gratuito', 'voces fazem orcamento', 'cobra pra fazer orcamento'],
      answer: 'Sim, o orçamento é gratuito e sem compromisso. Me conta sobre o seu projeto que já te dou um direcionamento inicial.',
    },
    {
      id: 'contact',
      phrases: ['como falo com voces', 'quero falar com um humano', 'quero falar com humano', 'falar com humano', 'falar com uma pessoa', 'atendimento humano', 'contato', 'telefone', 'whatsapp de voces', 'email de voces'],
      words: ['contato', 'whatsapp', 'email', 'telefone'],
      answer: '__CONTACT__',
    },
  ];

  var GREETINGS = {
    phrases: ['bom dia', 'boa tarde', 'boa noite'],
    words: ['oi', 'ola', 'olá', 'opa', 'eae', 'salve', 'hey', 'hello'],
  };

  var GREETING_ANSWER =
    'Fala! Eu sou a **Kira**, assistente de IA da Black Void Studio. Posso te ajudar com preços, prazos, tecnologias ou qualquer dúvida sobre desenvolvimento de sites, sistemas, automações e IA. O que você quer saber?';

  var FALLBACK_ANSWER_TEMPLATE =
    'Essa eu não tenho de forma pronta — mas não quero te dar resposta genérica. Melhor falar direto com o time:\n\n📧 __EMAIL__\n💬 __WHATSAPP__\n\nOu me pergunta de outro jeito, às vezes eu só não peguei a palavra-chave certa.';

  /* ======================================================================
     3. MATCHING ENGINE
     ====================================================================== */

  function stripAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function normalize(str) {
    return stripAccents(String(str || '').toLowerCase())
      .replace(/[^\w\s?]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function hasWord(text, word) {
    var re = new RegExp('(^|\\s)' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)');
    return re.test(text);
  }

  function scoreIntent(norm, intent) {
    var score = 0;
    var phrases = intent.phrases || [];
    for (var i = 0; i < phrases.length; i++) {
      if (norm.indexOf(normalize(phrases[i])) !== -1) score += 3;
    }
    var words = intent.words || [];
    for (var j = 0; j < words.length; j++) {
      if (hasWord(norm, normalize(words[j]))) score += 1;
    }
    return score;
  }

  function isGreetingOnly(norm) {
    if (norm.split(' ').length > 4) return false;
    for (var i = 0; i < GREETINGS.phrases.length; i++) {
      if (norm.indexOf(normalize(GREETINGS.phrases[i])) !== -1) return true;
    }
    var tokens = norm.split(' ');
    for (var j = 0; j < tokens.length; j++) {
      if (GREETINGS.words.indexOf(tokens[j]) !== -1) return true;
    }
    return false;
  }

  function findLocalAnswer(message) {
    var norm = normalize(message);
    if (!norm) return null;

    if (isGreetingOnly(norm)) {
      return GREETING_ANSWER;
    }

    var best = null;
    var bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var s = scoreIntent(norm, KB[i]);
      if (s > bestScore) {
        bestScore = s;
        best = KB[i];
      }
    }

    if (best && bestScore >= 1) {
      return resolveAnswer(best.answer);
    }
    return null;
  }

  function resolveAnswer(answer) {
    if (answer === '__CONTACT__') {
      var lines = ['Pode falar direto com a gente:'];
      if (CONFIG.contact.whatsapp) lines.push('💬 WhatsApp: ' + CONFIG.contact.whatsapp);
      if (CONFIG.contact.email) lines.push('📧 E-mail: ' + CONFIG.contact.email);
      if (CONFIG.contact.instagram) lines.push('📷 Instagram: ' + CONFIG.contact.instagram);
      if (CONFIG.contact.linkedin) lines.push('💼 LinkedIn: ' + CONFIG.contact.linkedin);
      return lines.join('\n');
    }
    return answer;
  }

  function fallbackAnswer() {
    return FALLBACK_ANSWER_TEMPLATE.replace('__EMAIL__', CONFIG.contact.email || '—').replace(
      '__WHATSAPP__',
      CONFIG.contact.whatsapp || '—'
    );
  }

  /* ======================================================================
     4. LLM FALLBACK
     ====================================================================== */

  function getApiKey() {
    try {
      if (typeof window.apiConfig !== 'undefined' && typeof window.apiConfig.getApiKey === 'function') {
        var k = window.apiConfig.getApiKey();
        if (k) return k;
      }
    } catch (e) { }
    try {
      return localStorage.getItem('grok_key') || localStorage.getItem('kira_api_key') || '';
    } catch (e) {
      return '';
    }
  }

  var SYSTEM_PROMPT =
    'Você é a Kira, assistente de IA da Black Void Studio, um estúdio brasileiro de tecnologia (Dourados, MS) especializado em ' +
    'desenvolvimento de sites, sistemas sob medida, automações e Inteligência Artificial, além de infraestrutura e cibersegurança. ' +
    'Responda sempre em português brasileiro, de forma direta, técnica mas acessível, sem enrolação, no máximo 3 parágrafos curtos ou uma lista objetiva. ' +
    'Preços de referência: Landing Page a partir de R$ 897, Site Institucional a partir de R$ 1.497, Loja Virtual a partir de R$ 2.990, ' +
    'Sistemas/IA/Automações/Infraestrutura sob orçamento personalizado. Prazos: Landing Page 3-7 dias, Site 7-15 dias, Loja 15-30 dias, Sistema conforme escopo. ' +
    'Se não souber algo específico, seja honesto e direcione para contato humano em vez de inventar. Nunca prometa o que a empresa não faz.';

  function askLLM(message, history) {
    var apiKey = getApiKey();
    if (!CONFIG.llm.enabled || !apiKey) return Promise.resolve(null);

    var messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    var recent = history.slice(-6);
    for (var i = 0; i < recent.length; i++) {
      messages.push({ role: recent[i].role === 'user' ? 'user' : 'assistant', content: recent[i].text });
    }
    messages.push({ role: 'user', content: message });

    return fetch(CONFIG.llm.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model: CONFIG.llm.model,
        temperature: CONFIG.llm.temperature,
        max_tokens: CONFIG.llm.maxTokens,
        messages: messages,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('LLM request failed: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        return (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || null;
      })
      .catch(function (err) {
        console.warn('[Kira] LLM fallback failed, using local answer instead.', err);
        return null;
      });
  }

  /* ======================================================================
     5. UI — injeção de estilos
     ====================================================================== */

  var STYLE_ID = 'kira-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      ':root{' +
      '--kira-bg:#050505;--kira-panel:#0b0b0d;--kira-panel-2:#111114;--kira-border:rgba(255,255,255,.08);' +
      '--kira-text:#f2f2f2;--kira-muted:#8a8a92;--kira-accent:#e02920;--kira-accent-2:#ff5a4d;' +
      '--kira-radius:18px;--kira-font:"Outfit","Inter",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
      '}' +

      /* ROOT — pointer-events:none para não bloquear NADA */
      '.kira-root{position:fixed !important;isolation:isolate;z-index:2147483000;font-family:var(--kira-font);' +
      'right:24px !important;left:auto !important;' +
      'top:auto !important;bottom:24px !important;display:flex;flex-direction:column;align-items:flex-end;' +
      'gap:14px;pointer-events:none !important;}' +

      /* Popover overrides — forçar posição direita */
      '.kira-root[popover],.kira-root:popover-open{' +
      'margin:0 !important;padding:0 !important;border:none !important;' +
      'background:transparent !important;color:inherit !important;overflow:visible !important;' +
      'max-width:none !important;max-height:none !important;width:auto !important;height:auto !important;' +
      'position:fixed !important;right:24px !important;left:auto !important;top:auto !important;bottom:24px !important;' +
      'display:flex !important;flex-direction:column !important;align-items:flex-end !important;' +
      'pointer-events:none !important;' +
      '}' +

      '.kira-root *{box-sizing:border-box;}' +

      /* LAUNCHER — só ele recebe clique quando chat fechado */
      '.kira-launcher{position:relative;width:62px;height:62px;border-radius:50%;border:1px solid var(--kira-border);' +
      'background:radial-gradient(circle at 30% 25%,#1a1a1d,#000 70%);cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'box-shadow:0 10px 30px rgba(0,0,0,.55),0 0 0 0 rgba(224,41,32,.4);transition:transform .25s ease,box-shadow .25s ease;' +
      'animation:kira-breathe 4s ease-in-out infinite;pointer-events:auto !important;}' +
      '.kira-launcher:hover{transform:scale(1.06);}' +
      '.kira-launcher:active{transform:scale(.96);}' +
      '.kira-launcher.kira-hide{opacity:0;pointer-events:none !important;transform:scale(.85);}' +
      '@keyframes kira-breathe{0%,100%{box-shadow:0 10px 30px rgba(0,0,0,.55),0 0 0 0 rgba(224,41,32,.35);}' +
      '50%{box-shadow:0 10px 34px rgba(0,0,0,.6),0 0 0 8px rgba(224,41,32,0);}}' +
      '.kira-launcher svg{width:26px;height:26px;position:relative;z-index:2;}' +
      '.kira-launcher-ring{position:absolute;inset:-2px;border-radius:50%;padding:1px;' +
      'background:conic-gradient(from 0deg,var(--kira-accent),transparent 30%,transparent 70%,var(--kira-accent-2));' +
      '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);' +
      '-webkit-mask-composite:xor;mask-composite:exclude;animation:kira-spin 6s linear infinite;}' +
      '@keyframes kira-spin{to{transform:rotate(360deg);}}' +
      '.kira-dot{position:absolute;top:2px;right:2px;width:12px;height:12px;border-radius:50%;background:var(--kira-accent);' +
      'border:2px solid #050505;animation:kira-pulse 2s infinite;}' +
      '@keyframes kira-pulse{0%,100%{box-shadow:0 0 0 0 rgba(224,41,32,.6);}50%{box-shadow:0 0 0 6px rgba(224,41,32,0);}}' +

      /* LAUNCHER INVISÍVEL ATÉ O SITE CARREGAR */
      '.kira-launcher{opacity:0;pointer-events:none !important;transition:opacity .5s ease,transform .25s ease,box-shadow .25s ease;}' +
      '.kira-launcher.kira-ready{opacity:1;pointer-events:auto !important;}' +
      '.kira-launcher.kira-ready.kira-hide{opacity:0;pointer-events:none !important;}' +
      /* PANEL — pointer-events:none quando fechado, auto quando aberto */
      '.kira-panel{width:392px;max-width:calc(100vw - 32px);height:588px;max-height:calc(100vh - 120px);' +
      'background:linear-gradient(180deg,var(--kira-panel) 0%,var(--kira-panel-2) 100%);border:1px solid var(--kira-border);' +
      'border-radius:var(--kira-radius);display:flex;flex-direction:column;overflow:hidden;' +
      'box-shadow:0 24px 70px rgba(0,0,0,.6),0 2px 0 rgba(255,255,255,.03) inset;' +
      'opacity:0;transform:translateY(16px) scale(.98);pointer-events:none !important;transition:opacity .28s ease,transform .28s ease;}' +
      '.kira-panel.kira-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto !important;}' +

      /* HEADER */
      '.kira-header{display:flex;align-items:center;gap:12px;padding:16px 16px 14px;border-bottom:1px solid var(--kira-border);' +
      'background:linear-gradient(180deg,rgba(255,255,255,.03),transparent);}' +
      '.kira-avatar{width:38px;height:38px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;' +
      'background:radial-gradient(circle at 30% 25%,#1c1c1f,#000 70%);border:1px solid var(--kira-border);position:relative;}' +
      '.kira-avatar svg{width:18px;height:18px;}' +
      '.kira-header-text{flex:1;min-width:0;}' +
      '.kira-header-text h4{margin:0;font-size:14.5px;font-weight:600;color:var(--kira-text);letter-spacing:.2px;}' +
      '.kira-header-text p{margin:2px 0 0;font-size:11.5px;color:var(--kira-muted);display:flex;align-items:center;gap:5px;}' +
      '.kira-status-dot{width:6px;height:6px;border-radius:50%;background:#3ddc7a;box-shadow:0 0 6px #3ddc7a;}' +

      /* BOTÃO X */
      '.kira-close{background:none;border:none;color:var(--kira-muted);cursor:pointer;padding:6px;border-radius:8px;' +
      'display:flex;align-items:center;justify-content:center;transition:.2s;flex:none;width:32px;height:32px;}' +
      '.kira-close:hover{color:var(--kira-text);background:rgba(255,255,255,.06);}' +
      '.kira-close svg{width:18px;height:18px;}' +

      /* MESSAGES */
      '.kira-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}' +
      '.kira-messages::-webkit-scrollbar{width:6px;}' +
      '.kira-messages::-webkit-scrollbar-thumb{background:#2a2a2e;border-radius:3px;}' +
      '.kira-msg{display:flex;animation:kira-fade .22s ease;}' +
      '@keyframes kira-fade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}' +
      '.kira-msg.user{justify-content:flex-end;}' +
      '.kira-bubble{max-width:82%;padding:10px 13px;border-radius:14px;font-size:13.2px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word;}' +
      '.kira-msg.user .kira-bubble{background:linear-gradient(135deg,#1c1c22,#141417);color:#fff;border-bottom-right-radius:4px;border:1px solid rgba(255,255,255,.06);}' +
      '.kira-msg.bot .kira-bubble{background:var(--kira-panel-2);color:#e7e7ea;border-left:2px solid var(--kira-accent);border-bottom-left-radius:4px;}' +
      '.kira-bubble b{color:#fff;font-weight:600;}' +
      '.kira-bubble a{color:var(--kira-accent-2);text-decoration:underline;cursor:pointer;}' +
      '.kira-bubble .kira-li{padding-left:14px;position:relative;}' +
      '.kira-bubble .kira-li::before{content:"–";position:absolute;left:0;color:var(--kira-accent-2);}' +

      /* TYPING */
      '.kira-typing{display:flex;gap:4px;padding:12px 14px;background:var(--kira-panel-2);border-left:2px solid var(--kira-accent);' +
      'border-radius:14px;border-bottom-left-radius:4px;width:fit-content;}' +
      '.kira-typing span{width:6px;height:6px;border-radius:50%;background:var(--kira-muted);animation:kira-typing 1.3s infinite ease-in-out;}' +
      '.kira-typing span:nth-child(2){animation-delay:.15s;}.kira-typing span:nth-child(3){animation-delay:.3s;}' +
      '@keyframes kira-typing{0%,60%,100%{opacity:.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-4px);}}' +

      /* SUGGESTIONS */
      '.kira-suggestions{padding:0 16px 12px;display:flex;flex-direction:column;gap:7px;}' +
      '.kira-chip{text-align:left;padding:10px 12px;border-radius:11px;border:1px solid var(--kira-border);background:rgba(255,255,255,.02);' +
      'color:#d6d6da;font-size:12.5px;cursor:pointer;font-family:var(--kira-font);transition:.18s;}' +
      '.kira-chip:hover{border-color:rgba(224,41,32,.5);background:rgba(224,41,32,.08);color:#fff;}' +

      /* INPUT BAR */
      '.kira-inputbar{display:flex;align-items:flex-end;gap:8px;padding:12px;border-top:1px solid var(--kira-border);' +
      'background:linear-gradient(0deg,rgba(255,255,255,.02),transparent);}' +
      '.kira-input{flex:1;resize:none;max-height:96px;background:#151517;border:1px solid var(--kira-border);border-radius:12px;' +
      'color:#fff;padding:10px 12px;font-size:13px;font-family:var(--kira-font);outline:none;transition:border-color .2s;line-height:1.4;}' +
      '.kira-input:focus{border-color:rgba(224,41,32,.55);}' +
      '.kira-input::placeholder{color:#5b5b62;}' +
      '.kira-input::-webkit-scrollbar{display:none;}' +
      '.kira-input{scrollbar-width:none;-ms-overflow-style:none;overflow:hidden;}' +
      '.kira-send{flex:none;width:38px;height:38px;border-radius:11px;border:none;cursor:pointer;display:flex;align-items:center;' +
      'justify-content:center;background:linear-gradient(135deg,var(--kira-accent),#a4180f);color:#fff;transition:.18s;}' +
      '.kira-send:hover{filter:brightness(1.12);transform:translateY(-1px);}' +
      '.kira-send:disabled{opacity:.4;cursor:not-allowed;transform:none;}' +
      '.kira-send svg{width:16px;height:16px;}' +

      /* FOOTER */
      '.kira-footer{text-align:center;font-size:10px;color:#4d4d53;padding:0 0 10px;letter-spacing:.3px;}' +
      '.kira-footer b{color:#77777d;}' +
      /* Adicione isso no CSS, dentro do injectStyles() */

      /* FORÇAR CURSOR VISÍVEL dentro do chat */
      '.kira-root,.kira-root *{cursor:default !important;}' +
      '.kira-launcher{cursor:pointer !important;}' +
      '.kira-close{cursor:pointer !important;}' +
      '.kira-send{cursor:pointer !important;}' +
      '.kira-send:disabled{cursor:not-allowed !important;}' +
      '.kira-chip{cursor:pointer !important;}' +
      '.kira-input{cursor:text !important;}' +
      '.kira-bubble a{cursor:pointer !important;}' +
      '.kira-messages{cursor:default !important;}' +

      /* MOBILE */
      '@media (max-width:600px){' +
      '.kira-root,.kira-root[popover],.kira-root:popover-open{right:14px !important;left:14px !important;bottom:14px !important;top:auto !important;align-items:stretch !important;}' +
      '.kira-panel{width:100%;max-width:none;height:78vh;max-height:none;}' +
      '.kira-launcher{align-self:flex-end;}' +
      '}';
    document.head.appendChild(style);
  }

  /* ======================================================================
     6. UI — construção do DOM
     ====================================================================== */

  var ICON_SPARK =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.2 9.2L21 12L14.2 14.8L12 22L9.8 14.8L3 12L9.8 9.2L12 2Z" fill="url(#kg1)"/><defs><linearGradient id="kg1" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#ff5a4d"/><stop offset="1" stop-color="#e02920"/></linearGradient></defs></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICON_SEND =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L20 4L14 20L11 13L4 12Z" fill="currentColor"/></svg>';

  var els = {};
  var state = { open: false, loading: false, history: [], firstOpen: true };

  function anchorToTopLayer(root) {
    try {
      if (typeof root.showPopover === 'function' && !root.hasAttribute('popover')) {
        root.setAttribute('popover', 'manual');
      }
      if (typeof root.showPopover === 'function') {
        try { root.showPopover(); } catch (e) { }
        return;
      }
    } catch (e) { }

    if (root.parentNode === document.body && document.body.lastElementChild !== root) {
      document.body.appendChild(root);
    }
  }

  function buildDOM() {
    var root = document.createElement('div');
    root.className = 'kira-root';
    root.innerHTML =
      '<div class="kira-panel" role="dialog" aria-label="' + CONFIG.name + '">' +
      '<div class="kira-header">' +
      '<div class="kira-avatar">' + ICON_SPARK + '</div>' +
      '<div class="kira-header-text">' +
      '<h4>' + CONFIG.name + '</h4>' +
      '<p><span class="kira-status-dot"></span>' + CONFIG.role + '</p>' +
      '</div>' +
      '<button class="kira-close" aria-label="Fechar" title="Fechar (Esc)">' + ICON_CLOSE + '</button>' +
      '</div>' +
      '<div class="kira-messages"></div>' +
      '<div class="kira-suggestions"></div>' +
      '<div class="kira-inputbar">' +
      '<textarea class="kira-input" rows="1" placeholder="Digite sua mensagem..." aria-label="Mensagem"></textarea>' +
      '<button class="kira-send" aria-label="Enviar">' + ICON_SEND + '</button>' +
      '</div>' +
      '<div class="kira-footer">Powered by <b>Black Void Studio</b></div>' +
      '</div>' +
      '<button class="kira-launcher" aria-label="Abrir ' + CONFIG.name + '">' +
      '<span class="kira-launcher-ring"></span>' +
      ICON_SPARK +
      '<span class="kira-dot" id="kira-notif-dot"></span>' +
      '</button>';
    // Esperar o site carregar completamente antes de mostrar o launcher
    window.addEventListener('load', function () {
      setTimeout(function () {
        els.launcher.classList.add('kira-ready');
      }, 1600); // pequeno delay pra ficar suave
    });

    document.body.appendChild(root);
    anchorToTopLayer(root);
    window.addEventListener('resize', function () { anchorToTopLayer(root); });

    els.root = root;
    els.panel = root.querySelector('.kira-panel');
    els.launcher = root.querySelector('.kira-launcher');
    els.close = root.querySelector('.kira-close');
    els.messages = root.querySelector('.kira-messages');
    els.suggestions = root.querySelector('.kira-suggestions');
    els.input = root.querySelector('.kira-input');
    els.send = root.querySelector('.kira-send');
    els.notifDot = root.querySelector('#kira-notif-dot');

    bindEvents();
    renderSuggestions();

    // Limpar histórico salvo ao carregar (garante reset ao fechar/reabrir site)
    clearStoredHistory();

    try {
      if (localStorage.getItem(CONFIG.seenKey)) {
        els.notifDot.style.display = 'none';
      }
    } catch (e) { }
  }

  function clearStoredHistory() {
    try {
      localStorage.removeItem(CONFIG.storageKey);
    } catch (e) { }
  }

  function bindEvents() {
    els.launcher.addEventListener('click', open);
    els.close.addEventListener('click', close);
    els.send.addEventListener('click', handleSend);
    els.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    els.input.addEventListener('input', function () {
      els.input.style.height = 'auto';
      var newHeight = Math.min(els.input.scrollHeight, 96);
      els.input.style.height = newHeight + 'px';
      // Se atingiu o máximo, permite scroll interno sem mostrar barra
      if (els.input.scrollHeight > 96) {
        els.input.style.overflow = 'auto';
      } else {
        els.input.style.overflow = 'hidden';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.open) close();
    });
  }

  function open() {
    anchorToTopLayer(els.root);
    state.open = true;
    els.panel.classList.add('kira-open');
    els.launcher.classList.add('kira-hide');
    els.notifDot.style.display = 'none';
    try { localStorage.setItem(CONFIG.seenKey, '1'); } catch (e) { }
    setTimeout(function () { els.input.focus(); }, 250);

    if (state.firstOpen && CONFIG.greetOnFirstOpen && state.history.length === 0) {
      state.firstOpen = false;
      pushMessage('bot', GREETING_ANSWER, false);
    }
  }

  function close() {
    state.open = false;
    els.panel.classList.remove('kira-open');
    els.launcher.classList.remove('kira-hide');
  }

  /* ---------- Renderização de mensagens ---------- */

  function mdLite(text) {
    var escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    escaped = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    var lines = escaped.split('\n').map(function (line) {
      if (/^-\s+/.test(line)) return '<div class="kira-li">' + line.replace(/^-\s+/, '') + '</div>';
      return line;
    });
    return lines.join('<br/>').replace(/(<br\/>)?(<div class="kira-li">)/g, '$2');
  }

  function pushMessage(role, text, persist) {
    state.history.push({ role: role, text: text, ts: Date.now() });

    var msg = document.createElement('div');
    msg.className = 'kira-msg ' + (role === 'user' ? 'user' : 'bot');
    var bubble = document.createElement('div');
    bubble.className = 'kira-bubble';
    bubble.innerHTML = mdLite(text);
    msg.appendChild(bubble);
    els.messages.appendChild(msg);
    els.messages.scrollTop = els.messages.scrollHeight;
    hideSuggestions();
  }

  function showTyping() {
    var msg = document.createElement('div');
    msg.className = 'kira-msg bot';
    msg.id = 'kira-typing';
    msg.innerHTML = '<div class="kira-typing"><span></span><span></span><span></span></div>';
    els.messages.appendChild(msg);
    els.messages.scrollTop = els.messages.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('kira-typing');
    if (el) el.remove();
  }

  function renderSuggestions() {
    els.suggestions.innerHTML = '';
    if (!CONFIG.suggestions || !CONFIG.suggestions.length) return;
    CONFIG.suggestions.forEach(function (s) {
      var btn = document.createElement('button');
      btn.className = 'kira-chip';
      btn.type = 'button';
      btn.textContent = s;
      btn.addEventListener('click', function () {
        els.input.value = s;
        handleSend();
      });
      els.suggestions.appendChild(btn);
    });
  }

  function hideSuggestions() {
    if (els.suggestions.children.length) els.suggestions.innerHTML = '';
  }

  /* ---------- Envio ---------- */

  function handleSend() {
    var value = els.input.value.trim();
    if (!value || state.loading) return;

    els.input.value = '';
    els.input.style.height = 'auto';
    pushMessage('user', value);

    state.loading = true;
    els.send.disabled = true;
    showTyping();

    var local = findLocalAnswer(value);
    var delay = Math.min(
      CONFIG.typingDelay.max,
      Math.max(CONFIG.typingDelay.min, (local ? local.length : 80) * 6)
    );

    if (local) {
      setTimeout(function () {
        hideTyping();
        pushMessage('bot', local);
        state.loading = false;
        els.send.disabled = false;
        els.input.focus();
      }, delay);
      return;
    }

    askLLM(value, state.history)
      .then(function (reply) {
        hideTyping();
        pushMessage('bot', reply || fallbackAnswer());
      })
      .catch(function () {
        hideTyping();
        pushMessage('bot', fallbackAnswer());
      })
      .finally(function () {
        state.loading = false;
        els.send.disabled = false;
        els.input.focus();
      });
  }

  /* ======================================================================
     7. API PÚBLICA + BOOT
     ====================================================================== */

  function boot() {
    injectStyles();
    buildDOM();
  }

  window.Kira = {
    open: open,
    close: close,
    toggle: function () { state.open ? close() : open(); },
    sendMessage: function (text) {
      if (!els.input) return;
      els.input.value = text;
      if (!state.open) open();
      handleSend();
    },
    clearHistory: function () {
      state.history = [];
      clearStoredHistory();
      if (els.messages) els.messages.innerHTML = '';
      renderSuggestions();
    },
    configure: function (partial) {
      CONFIG = deepMerge(CONFIG, partial || {});
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();