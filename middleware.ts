// Edge Middleware para Vercel - Web APIs padrão (sem Next.js)
// Roteia: IAs conhecidas → /ia-crawler.html | Humanos → /home.html

const AI_CRAWLERS = [
  // OpenAI
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  // Anthropic
  'ClaudeBot', 'Claude-SearchBot', 'anthropic-ai',
  // Perplexity
  'PerplexityBot', 'Perplexity-User',
  // Google
  'Google-Extended', 'VertexAI', 'Gemini',
  // Microsoft
  'bingbot', 'MSNBot',
  // Meta
  'Meta-ExternalAgent', 'Meta-ExternalFetcher',
  // Apple
  'AppleBot',
  // Outros documentados
  'Bytespider', 'YouBot', 'CohereBot', 'MistralBot',
];

function isAICrawler(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return AI_CRAWLERS.some(crawler => ua.includes(crawler.toLowerCase()));
}

const EXCLUDED_PATHS = [
  '/assets/', '/components/', '/agent/', '/equipe/',
  '/black-void-pages/', '/docs/', '/api/', '/ia-crawler',
];

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PATHS.some(p => pathname.startsWith(p)) || pathname.includes('.');
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const pathname = url.pathname;

  // Excluir assets, api, arquivos com extensão, ia-crawler
  if (isExcluded(pathname)) {
    return fetch(request);
  }

  const isAI = isAICrawler(userAgent);

  // Raiz: rotear baseado no User-Agent
  if (pathname === '/') {
    const targetPath = isAI ? '/ia-crawler.html' : '/home.html';
    const targetUrl = new URL(targetPath, request.url);
    const response = await fetch(targetUrl, {
      headers: request.headers,
      method: request.method,
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.set('x-ai-crawler-routed', isAI ? 'true' : 'false');
    newHeaders.set('x-ai-user-agent', userAgent.slice(0, 200));
    newHeaders.set('x-served-content', isAI ? 'ia-crawler' : 'home');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  // Demais paths: fluxo normal (vercel.json rewrites ou 404)
  return fetch(request);
}

export const config = {
  matcher: [
    '/((?!assets|components|agent|equipe|black-void-pages|docs|api|.*\\..*|ia-crawler).*)',
  ],
};