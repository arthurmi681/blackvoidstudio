/**
 * BLACK VOID STUDIO — AI AGENT UI
 * Interface visual e integração do chat
 */

class VoidAgentUI {
  constructor(containerId = 'void-agent-container', options = {}) {
    this.containerId = containerId;
    this.options = {
      position: 'bottom-right',
      minified: true,
      animationSpeed: 300,
      ...options,
    };
    this.isOpen = false;
    this.isLoading = false;
    this.init();
  }

  init() {
    this.createContainer();
    this.setupEventListeners();
    console.log('[VoidAgentUI] Initialized');
  }

  createContainer() {
    // Container principal
    const container = document.createElement('div');
    container.id = this.containerId;
    container.className = `void-agent-container ${this.options.position}`;
    container.innerHTML = `
      <!-- Chat Widget -->
      <div class="void-chat-widget">
        <!-- Header -->
        <div class="void-chat-header">
          <div class="void-chat-title">
            <span class="void-icon">◇</span>
            <span class="void-name">VOID</span>
          </div>
          <button class="void-close-btn" aria-label="Fechar chat">✕</button>
        </div>

        <!-- Messages -->
        <div class="void-chat-messages" id="void-messages"></div>

        <!-- Input -->
        <div class="void-chat-input-wrap">
          <input 
            type="text" 
            id="void-input" 
            class="void-chat-input" 
            placeholder="Digite sua mensagem..."
            autocomplete="off"
          />
          <button class="void-send-btn" id="void-send">▶</button>
        </div>
      </div>

      <!-- Toggle Button (when minified) -->
      <button class="void-toggle-btn" title="Abrir VOID">
        <span class="void-toggle-icon">◇</span>
      </button>
    `;

    document.body.appendChild(container);
    this.setupStyles();
  }

  setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ── VOID AGENT UI ── */
      .void-agent-container {
        position: fixed;
        z-index: 9999;
        font-family: 'Outfit', sans-serif;
      }

      .void-agent-container.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      .void-agent-container.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      /* ── TOGGLE BUTTON ── */
      .void-toggle-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #000, #1a1a1a);
        border: 2px solid #fff;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }

      .void-toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 30px rgba(255, 255, 255, 0.2);
      }

      .void-toggle-btn.hidden {
        display: none;
      }

      /* ── CHAT WIDGET ── */
      .void-chat-widget {
        width: 400px;
        height: 550px;
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
        animation: slideIn 0.3s ease;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .void-chat-widget.open {
        opacity: 1;
        pointer-events: auto;
      }

      @keyframes slideIn {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      /* ── HEADER ── */
      .void-chat-header {
        padding: 16px;
        border-bottom: 1px solid #222;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .void-chat-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
      }

      .void-icon {
        font-size: 16px;
        color: #fff;
      }

      .void-close-btn {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 18px;
        transition: color 0.2s;
        padding: 4px;
      }

      .void-close-btn:hover {
        color: #fff;
      }

      /* ── MESSAGES ── */
      .void-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .void-message {
        display: flex;
        gap: 8px;
        animation: fadeIn 0.2s ease;
      }

      .void-message.user {
        justify-content: flex-end;
      }

      .void-message.assistant {
        justify-content: flex-start;
      }

      .void-message-content {
        max-width: 85%;
        padding: 12px;
        border-radius: 8px;
        font-size: 13px;
        line-height: 1.5;
      }

      .void-message.user .void-message-content {
        background: #1a1a3a;
        color: #fff;
      }

      .void-message.assistant .void-message-content {
        background: #1a1a1a;
        color: #e0e0e0;
        border-left: 2px solid #fff;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* ── TYPING INDICATOR ── */
      .void-typing {
        display: flex;
        gap: 4px;
        padding: 12px;
      }

      .void-typing span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #666;
        animation: typing 1.4s infinite;
      }

      .void-typing span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .void-typing span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% {
          opacity: 0.3;
          transform: translateY(0);
        }
        30% {
          opacity: 1;
          transform: translateY(-10px);
        }
      }

      /* ── INPUT ── */
      .void-chat-input-wrap {
        padding: 12px;
        border-top: 1px solid #222;
        display: flex;
        gap: 8px;
      }

      .void-chat-input {
        flex: 1;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 6px;
        color: #fff;
        padding: 10px 12px;
        font-size: 13px;
        font-family: 'Outfit', sans-serif;
        outline: none;
        transition: border-color 0.2s;
      }

      .void-chat-input:focus {
        border-color: #666;
      }

      .void-send-btn {
        background: #fff;
        border: none;
        color: #000;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: all 0.2s;
      }

      .void-send-btn:hover {
        background: #f0f0f0;
        transform: scale(1.05);
      }

      .void-send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* ── SCROLLBAR ── */
      .void-chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .void-chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .void-chat-messages::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 3px;
      }

      .void-chat-messages::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      /* ── RESPONSIVE ── */
      @media (max-width: 600px) {
        .void-chat-widget {
          width: calc(100vw - 32px);
          height: 70vh;
          max-height: 600px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  setupEventListeners() {
    const toggleBtn = document.querySelector('.void-toggle-btn');
    const closeBtn = document.querySelector('.void-close-btn');
    const sendBtn = document.getElementById('void-send');
    const input = document.getElementById('void-input');

    toggleBtn?.addEventListener('click', () => this.toggle());
    closeBtn?.addEventListener('click', () => this.close());
    sendBtn?.addEventListener('click', () => this.sendMessage());
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.isLoading) this.sendMessage();
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    const widget = document.querySelector('.void-chat-widget');
    const toggleBtn = document.querySelector('.void-toggle-btn');
    widget?.classList.add('open');
    toggleBtn?.classList.add('hidden');
    this.isOpen = true;
    document.getElementById('void-input')?.focus();
  }

  close() {
    const widget = document.querySelector('.void-chat-widget');
    const toggleBtn = document.querySelector('.void-toggle-btn');
    widget?.classList.remove('open');
    toggleBtn?.classList.remove('hidden');
    this.isOpen = false;
  }

  async sendMessage() {
    const input = document.getElementById('void-input');
    const message = input?.value?.trim();

    if (!message || this.isLoading || !voidAgent) return;

    this.isLoading = true;
    input.disabled = true;

    // Adicionar mensagem do usuário
    this.addMessage(message, 'user');
    input.value = '';

    // Mostrar indicador de digitação
    this.showTyping();

    try {
      // Chamar agente (pode ser local ou API)
      const response = await voidAgent.chatSmartLocal(message);
      this.removeTyping();
      this.addMessage(response, 'assistant');
    } catch (error) {
      this.removeTyping();
      this.addMessage(`Erro: ${error.message}`, 'assistant');
    } finally {
      this.isLoading = false;
      input.disabled = false;
      input.focus();
    }
  }

  addMessage(content, role) {
    const messagesDiv = document.getElementById('void-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `void-message ${role}`;
    messageEl.innerHTML = `
      <div class="void-message-content">${this.escapeHtml(content)}</div>
    `;
    messagesDiv?.appendChild(messageEl);
    messagesDiv?.scrollTo(0, messagesDiv.scrollHeight);
  }

  showTyping() {
    const messagesDiv = document.getElementById('void-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'void-message assistant void-typing';
    typingEl.id = 'void-typing-indicator';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    messagesDiv?.appendChild(typingEl);
    messagesDiv?.scrollTo(0, messagesDiv.scrollHeight);
  }

  removeTyping() {
    document.getElementById('void-typing-indicator')?.remove();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ── INICIALIZAÇÃO ──
function initVoidAgentUI(containerId, options = {}) {
  const ui = new VoidAgentUI(containerId, options);
  return ui;
}

if (typeof window !== 'undefined') {
  window.VoidAgentUI = VoidAgentUI;
  window.initVoidAgentUI = initVoidAgentUI;
}
