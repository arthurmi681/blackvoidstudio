/**
 * BLACK VOID STUDIO — AI AGENT
 * Assistente inteligente para o site
 */

class VoidAgent {
  constructor(config = {}) {
    this.config = { ...this.defaultConfig, ...config };
    this.conversationHistory = [];
    this.init();
  }

  defaultConfig = {
    name: 'VOID',
    apiEndpoint: this.config?.apiEndpoint || 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama3-70b-8192',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: `Você é o VOID, assistente de IA da Black Void Studio — estúdio especializado em sites que transformam negócios. 

CONTEXTO DO SITE:
- Serviços: Desenvolvimento web (React, Node.js), design dark editorial, otimização de conversão
- Marcas: Black Void Studio (principal), Bylune (fashion), Arthur Miyazaki (portfólio pessoal)
- Estética: Dark cyberpunk, quiet luxury, minimalista
- Tecnologias: React.js, TypeScript, Tailwind CSS, Node.js, MongoDB

PERSONALIDADE:
- Direto, sem enrolação
- Técnico mas acessível
- Especialista em web development e negócios digitais
- Sarcástico quando apropriado
- Sempre sugere melhorias proativas

REGRAS:
- Responda em português brasileiro
- Seja conciso (máx 2-3 parágrafos por resposta)
- Se não souber algo específico recente, seja honesto
- Ofereça soluções práticas e implementáveis
- Sempre mencione a importância de design + código + conversão`,
  };

  init() {
    this.loadConversationHistory();
    this.setupEventListeners();
  }

  async chat(userMessage) {
    try {
      // Validar mensagem
      if (!userMessage || userMessage.trim().length === 0) return null;

      // Adicionar à histórico
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      });

      // Preparar payload
      const payload = {
        model: this.config.model,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        system: this.config.systemPrompt,
        messages: this.conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      };

      // Chamar API
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getApiKey()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Salvar resposta no histórico
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
      });

      // Persistir histórico
      this.saveConversationHistory();

      return assistantMessage;
    } catch (error) {
      console.error('[VoidAgent] Error:', error);
      return `Erro ao processar: ${error.message}`;
    }
  }

  // ── LOCAL RESPONSES (sem API) ──
  localResponses = {
    oi: 'E aí. Sou o VOID, assistente da Black Void Studio. Como posso ajudar?',
    ola: 'E aí. Sou o VOID, assistente da Black Void Studio. Como posso ajudar?',
    servicos:
      'A gente trabalha com:\n\n1. **Desenvolvimento Web** — React, Node.js, TypeScript\n2. **Design Dark Editorial** — Estética cyberpunk minimalista\n3. **Otimização de Conversão** — Não é só bonito, tem que vender\n4. **Estratégia Digital** — Consult full stack\n\nQual interesse você?',
    portifolio:
      'Conheça nossos projetos:\n\n**Bylune** — Fashion brand UK com Shopify customizado\n**Arthur Miyazaki** — Portfólio de freelancer full stack\n**Black Void Studio** — Este site mesmo\n\nQuer detalhes de algum?',
    tecnologia:
      'Stack atual: React.js, TypeScript, Tailwind CSS, Node.js, MongoDB. Tudo moderno, escalável e com performance em primeiro lugar. Outras tech conforme necessidade do projeto.',
    preco:
      'Orçamento depende do escopo. Projetos variam de landing pages (mais acessível) até plataformas completas. Chama no contato pra conversa específica.',
    contato:
      'Usa o formulário no site ou entra em contato via social. Resposta rápida garantida se for negócio sério.',
  };

  async chatLocal(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // Verificar respostas locais
    for (const [key, response] of Object.entries(this.localResponses)) {
      if (msg.includes(key)) {
        this.conversationHistory.push(
          { role: 'user', content: userMessage, timestamp: new Date() },
          { role: 'assistant', content: response, timestamp: new Date() }
        );
        this.saveConversationHistory();
        return response;
      }
    }

    return null; // Não encontrou resposta local
  }

  async chatSmartLocal(userMessage) {
    // Tenta resposta local primeiro (rápido)
    const localResp = await this.chatLocal(userMessage);
    if (localResp) return localResp;

    // Se não encontrar, tenta API
    return await this.chat(userMessage);
  }

  getApiKey() {
    // Usar apiConfig global (gerenciador seguro)
    if (typeof apiConfig !== 'undefined' && apiConfig.getApiKey) {
      return apiConfig.getApiKey();
    }
    // Fallback para localStorage (legacy)
    return localStorage.getItem('grok_key') || '';
  }

  loadConversationHistory() {
    const stored = localStorage.getItem('void_conversation_history');
    this.conversationHistory = stored ? JSON.parse(stored) : [];
  }

  saveConversationHistory() {
    localStorage.setItem('void_conversation_history', JSON.stringify(this.conversationHistory));
  }

  clearHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('void_conversation_history');
  }

  setupEventListeners() {
    // Pode ser extendido para interações específicas
  }
}

// ── INICIALIZAÇÃO ──
let voidAgent = null;

function initVoidAgent(config = {}) {
  voidAgent = new VoidAgent(config);
  console.log('[VoidAgent] Initialized');
  return voidAgent;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.VoidAgent = VoidAgent;
  window.initVoidAgent = initVoidAgent;
}
