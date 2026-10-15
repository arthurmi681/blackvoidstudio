// Edge Middleware para Vercel - Web APIs padrão (sem Next.js)
// Direciona crawlers de IA reconhecidos para /ia-crawler.html internamente

// Lista de user-agents de crawlers de IA conhecidos (baseado em documentação pública)
const AI_CRAWLERS = [
  // OpenAI
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',

  // Anthropic
  'ClaudeBot',
  'Claude-SearchBot',
  'anthropic-ai',

  // Perplexity
  'PerplexityBot',
  'Perplexity-User',

  // Google
  'Google-Extended',
  'VertexAI',
  'Gemini',

  // Microsoft
  'bingbot',
  'MSNBot',

  // Meta
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',

  // Apple
  'AppleBot',

  // Outros documentados
  'Bytespider',
  'YouBot',
  'CohereBot',
  'MistralBot',
];

function isAICrawler(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return AI_CRAWLERS.some(crawler => ua.includes(crawler.toLowerCase()));
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const pathname = url.pathname;

  // Não processar assets, api, arquivos com extensão, nem a própria página ia-crawler
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/components/') ||
    pathname.startsWith('/agent/') ||
    pathname.startsWith('/equipe/') ||
    pathname.startsWith('/black-void-pages/') ||
    pathname.startsWith('/docs/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') || // arquivos com extensão (.css, .js, .svg, etc.)
    pathname === '/ia-crawler.html' ||
    pathname === '/ia-crawler'
  ) {
    return fetch(request); // passa direto
  }

  // Verificar se é crawler de IA
  const isAI = isAICrawler(userAgent);

  // Se for IA acessando a raiz, reescrever internamente para /ia-crawler.html
  if (isAI && pathname === '/') {
    const iaUrl = new URL('/ia-crawler.html', request.url);
    const response = await fetch(iaUrl, {
      headers: request.headers,
      method: request.method,
    });

    // Adicionar headers de debug para identificar o roteamento
    const newHeaders = new Headers(response.headers);
    newHeaders.set('x-ai-crawler-routed', 'true');
    newHeaders.set('x-ai-user-agent', userAgent.slice(0, 200));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  // Para humanos e outros paths, deixar o fluxo normal (serve index.html ou outros arquivos)
  return fetch(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - assets, components, agent, equipe, black-void-pages, docs, api
     * - files with extensions
     * - ia-crawler.html itself
     */
    '/((?!assets|components|agent|equipe|black-void-pages|docs|api|.*\\..*|ia-crawler).*)',
  ],
};