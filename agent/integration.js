/**
 * BLACK VOID STUDIO — AGENT INTEGRATION
 * Integração do agente com o painel assistant existente
 */

// Inicializar agente
let voidAssistant = null;

class VoidAssistantIntegration {
  constructor() {
    this.messagesEl = document.getElementById('assistMsgs');
    this.inputEl = document.getElementById('assistInput');
    this.panelEl = document.getElementById('assistant-panel');
    this.btnEl = document.getElementById('assistant-btn');
    this.isOpen = false;
    this.isLoading = false;
    
    this.init();
  }

  init() {
    // Respostas configuradas para perguntas comuns
    this.responses = {
      'quanto': 'Nosso pacote começa em R$ 1.497,00. Inclui site completo com 5+ páginas, domínio, hospedagem, SSL e 3 meses de suporte. Entrada de R$ 750, restante na entrega.',
      'preco': 'Nosso pacote começa em R$ 1.497,00. Inclui site completo com 5+ páginas, domínio, hospedagem, SSL e 3 meses de suporte. Entrada de R$ 750, restante na entrega.',
      'custa': 'Nosso pacote começa em R$ 1.497,00. Inclui site completo com 5+ páginas, domínio, hospedagem, SSL e 3 meses de suporte. Entrada de R$ 750, restante na entrega.',
      
      'prazo': 'Entregamos em até 14 dias corridos. Geralmente: dias 1-5 (design), dias 6-12 (desenvolvimento), dia 14 (lançamento). Você acompanha todo o processo.',
      'entrega': 'Entregamos em até 14 dias corridos. Geralmente: dias 1-5 (design), dias 6-12 (desenvolvimento), dia 14 (lançamento). Você acompanha todo o processo.',
      'tempo': 'Entregamos em até 14 dias corridos. Geralmente: dias 1-5 (design), dias 6-12 (desenvolvimento), dia 14 (lançamento). Você acompanha todo o processo.',
      
      'incluso': '✓ Site com 5+ páginas\n✓ Design responsivo\n✓ Domínio (1 ano)\n✓ Hospedagem premium (1 ano)\n✓ SSL certificado\n✓ SEO básico\n✓ Formulário de contato\n✓ Redes sociais integradas\n✓ 3 meses de suporte\n✓ WhatsApp flutuante',
      'incluido': '✓ Site com 5+ páginas\n✓ Design responsivo\n✓ Domínio (1 ano)\n✓ Hospedagem premium (1 ano)\n✓ SSL certificado\n✓ SEO básico\n✓ Formulário de contato\n✓ Redes sociais integradas\n✓ 3 meses de suporte\n✓ WhatsApp flutuante',
      
      'servicos': 'Oferecemos: Site institucional, Landing pages, E-commerce, SEO básico, Consultorias digitais. Tudo focado em transformar seu negócio em marca profissional.',
      'servico': 'Oferecemos: Site institucional, Landing pages, E-commerce, SEO básico, Consultorias digitais. Tudo focado em transformar seu negócio em marca profissional.',
      
      'tecnologia': 'Stack moderno: React.js, Node.js, TypeScript, Tailwind CSS, MongoDB. Tudo otimizado para performance, SEO e segurança.',
      'tech': 'Stack moderno: React.js, Node.js, TypeScript, Tailwind CSS, MongoDB. Tudo otimizado para performance, SEO e segurança.',
      
      'oi': 'E aí 👋 Bem-vindo ao Void! Como posso ajudar?',
      'ola': 'E aí 👋 Bem-vindo ao Void! Como posso ajudar?',
      'opa': 'E aí 👋 Bem-vindo ao Void! Como posso ajudar?',
      
      'contato': 'Você pode falar comigo agora! Ou entrar em contato direto:\n📧 blackvoidev@gmail.com\n💬 WhatsApp: https://wa.me/5511999999999\n📱 Instagram: @blackvoid.dev',
      
      'projeto': 'Ótimo! Conte-nos sobre sua empresa, o que precisa, e qualquer referência de site que goste. Vamos criar algo incrível! 🚀',
      'case': 'Temos vários cases de sucesso: Restaurante Bella Vita (+180% visitas), Studio Orquídea, Boutique Fleur, Construtora Álvarez e mais. Quer ver detalhes de algum?',
      'cases': 'Temos vários cases de sucesso: Restaurante Bella Vita (+180% visitas), Studio Orquídea, Boutique Fleur, Construtora Álvarez e mais. Quer ver detalhes de algum?',
      'portfolio': 'Temos vários cases de sucesso: Restaurante Bella Vita (+180% visitas), Studio Orquídea, Boutique Fleur, Construtora Álvarez e mais. Quer ver detalhes de algum?',
    };
  }

  findResponse(message) {
    const msg = message.toLowerCase();
    for (const [key, response] of Object.entries(this.responses)) {
      if (msg.includes(key)) {
        return response;
      }
    }
    return null;
  }

  addMessage(text, sender = 'user') {
    const msgEl = document.createElement('div');
    msgEl.className = `assist-msg ${sender}`;
    msgEl.innerHTML = `<span>${this.escapeHtml(text)}</span>`;
    this.messagesEl.appendChild(msgEl);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  addLoadingState() {
    const msgEl = document.createElement('div');
    msgEl.className = 'assist-msg bot loading';
    msgEl.id = 'loading-msg';
    msgEl.innerHTML = '<span></span><span></span><span></span>';
    this.messagesEl.appendChild(msgEl);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  removeLoadingState() {
    document.getElementById('loading-msg')?.remove();
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  async sendMessage() {
    const message = this.inputEl.value.trim();
    if (!message || this.isLoading) return;

    this.isLoading = true;
    this.inputEl.disabled = true;

    // Adicionar mensagem do usuário
    this.addMessage(message, 'user');
    this.inputEl.value = '';

    // Procurar resposta local
    const response = this.findResponse(message);

    if (response) {
      // Resposta imediata
      setTimeout(() => {
        this.addMessage(response, 'bot');
        this.isLoading = false;
        this.inputEl.disabled = false;
        this.inputEl.focus();
      }, 300);
    } else {
      // Resposta genérica para mensagens não catalogadas
      this.addLoadingState();
      setTimeout(() => {
        this.removeLoadingState();
        const genericResponse = `Obrigado pela pergunta! 😊 Para respostas mais específicas ou conversar sobre seu projeto, entre em contato direto:\n📧 blackvoidev@gmail.com\n💬 WhatsApp: https://wa.me/5511999999999`;
        this.addMessage(genericResponse, 'bot');
        this.isLoading = false;
        this.inputEl.disabled = false;
        this.inputEl.focus();
      }, 800);
    }
  }

  sendSuggestion(el) {
    const text = el.textContent.trim();
    this.inputEl.value = text;
    this.sendMessage();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.panelEl.classList.add('open');
    this.btnEl.classList.add('hidden');
    this.isOpen = true;
    this.inputEl.focus();
  }

  close() {
    this.panelEl.classList.remove('open');
    this.btnEl.classList.remove('hidden');
    this.isOpen = false;
  }
}

// ── FUNÇÕES GLOBAIS (para HTML) ──
function toggleAssistant() {
  if (!voidAssistant) return;
  voidAssistant.toggle();
}

function sendMessage() {
  if (!voidAssistant) return;
  voidAssistant.sendMessage();
}

function sendSuggestion(el) {
  if (!voidAssistant) return;
  voidAssistant.sendSuggestion(el);
}

// ── INICIALIZAR QUANDO DOCUMENTO ESTIVER PRONTO ──
document.addEventListener('DOMContentLoaded', () => {
  voidAssistant = new VoidAssistantIntegration();
  console.log('[VoidAssistant] Initialized');
});
