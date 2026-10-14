import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de user-agents conhecidos de crawlers de IA
const AI_CRAWLERS = [
  // OpenAI
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',

  // Anthropic
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',

  // Perplexity
  'PerplexityBot',
  'Perplexity-User',

  // Google
  'Google-Extended',
  'VertexAI',
  'Gemini',
  'Bard',

  // Microsoft
  'bingbot',
  'MSNBot',
  'Microsoft-Web-Exploration',

  // Meta
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'facebookexternalhit',

  // Apple
  'AppleBot',
  'Applebot',

  // Outros crawlers de IA conhecidos
  'CohereBot',
  'MistralBot',
  'HuggingFaceBot',
  'CommonCrawl',
  'CCBot',
  'Bytespider',
  'YouBot',
  'DuckDuckBot',
  'PetalBot',
  'SemrushBot',
  'AhrefsBot',
  'MJ12bot',
  'DotBot',
  'DataForSeoBot',
  'SeznamBot',
  'YandexBot',
  'Baiduspider',
  'Sogou',
  '360Spider',
  'Exabot',
  'Scrapy',
  'python-requests',
  'curl',
  'Wget',
  'Go-http-client',
  'Apache-HttpClient',
  'okhttp',
];

function isAICrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();

  // Verifica user-agents conhecidos de IA
  for (const crawler of AI_CRAWLERS) {
    if (ua.includes(crawler.toLowerCase())) {
      return true;
    }
  }

  // Heurísticas adicionais para bots genéricos que podem ser IA
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /fetcher/i,
    /search/i,
    /indexer/i,
    /archiver/i,
  ];

  // Se parece com bot mas não é navegador comum
  const isBot = botPatterns.some(pattern => pattern.test(ua));
  const isBrowser = /mozilla|chrome|safari|firefox|edge|opera/i.test(ua);

  return isBot && !isBrowser;
}

// IPs conhecidos de ranges de IA (opcional - mais confiável via user-agent)
const AI_IP_RANGES = [
  // OpenAI ranges (exemplos - manter atualizado)
  // '20.0.0.0/8', // Azure/OpenAI
  // Anthropic ranges
  // Google ranges
  // etc.
];

function isAIIP(ip: string): boolean {
  // Implementação opcional: verificar se IP está em ranges conhecidos de IA
  // Por enquanto retorna false - user-agent é mais confiável
  return false;
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const isAI = isAICrawler(userAgent) || isAIIP(ip);

  // Se for IA e não estiver já na página de IA, redireciona
  if (isAI && !request.nextUrl.pathname.startsWith('/ia-crawler')) {
    const url = request.nextUrl.clone();
    url.pathname = '/ia-crawler.html';
    // Adiciona header para debug/log
    const response = NextResponse.rewrite(url);
    response.headers.set('x-ai-crawler-detected', 'true');
    response.headers.set('x-ai-user-agent', userAgent.slice(0, 200));
    return response;
  }

  // Headers para ajudar IAs a entenderem a estrutura
  const response = NextResponse.next();
  response.headers.set('x-robots-tag', 'index, follow');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - static files (images, css, js, fonts)
     * - favicon
     * - files with extensions
     */
    '/((?!api|assets|components|_next|favicon.ico|.*\\..*).*)',
  ],
};