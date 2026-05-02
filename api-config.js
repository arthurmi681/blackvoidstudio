/**
 * API CONFIG — Gerenciador Seguro de Chaves
 * Carrega chave da API Groq de forma segura
 */

class ApiConfig {
  constructor() {
    this.apiKey = null;
    this.keySource = null; // 'env', 'localStorage', 'user-input'
    this.init();
  }

  init() {
    // 1. Tenta carregar do localStorage (usuário já configurou)
    const stored = localStorage.getItem('grok_key');
    if (stored && this.isValidKey(stored)) {
      this.apiKey = stored;
      this.keySource = 'localStorage';
      console.log('✅ Chave carregada do localStorage');
      return;
    }

    // 2. Tenta carregar da variável de ambiente (servidor Vercel)
    const envKey = import.meta.env?.VITE_GROQ_API_KEY;
    if (envKey && this.isValidKey(envKey)) {
      this.apiKey = envKey;
      this.keySource = 'env';
      localStorage.setItem('grok_key', envKey); // Salvar para futuro
      console.log('✅ Chave carregada de variáveis de ambiente');
      return;
    }

    // 3. Nenhuma chave disponível
    console.warn('⚠️  Nenhuma chave da API Groq encontrada');
    this.showKeyModal();
  }

  isValidKey(key) {
    return key && typeof key === 'string' && key.startsWith('gsk_') && key.length > 10;
  }

  getApiKey() {
    if (!this.apiKey) {
      console.error('❌ Chave da API não configurada');
      return null;
    }
    return this.apiKey;
  }

  setApiKey(key) {
    if (!this.isValidKey(key)) {
      console.error('❌ Formato de chave inválido');
      return false;
    }
    this.apiKey = key;
    this.keySource = 'user-input';
    localStorage.setItem('grok_key', key);
    console.log('✅ Chave da API definida');
    return true;
  }

  showKeyModal() {
    // Se o modal já existe, não criar outro
    if (document.getElementById('api-key-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'api-key-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      font-family: 'Outfit', sans-serif;
    `;

    modal.innerHTML = `
      <div style="
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
      ">
        <h2 style="color: #fff; margin: 0 0 16px; font-size: 24px;">⚙️ Configurar Chave da API</h2>
        
        <p style="color: #aaa; margin: 0 0 24px; line-height: 1.6;">
          Para usar o assistente de IA, você precisa adicionar sua chave da API Groq.
          <br><br>
          <strong style="color: #fff;">Não é seguro compartilhar chaves — use apenas em ambiente de testes!</strong>
        </p>

        <input 
          type="password" 
          id="api-key-input" 
          placeholder="gsk_..." 
          style="
            width: 100%;
            padding: 12px;
            background: #1a1a1a;
            border: 1px solid #333;
            color: #fff;
            border-radius: 6px;
            font-family: monospace;
            margin-bottom: 16px;
            box-sizing: border-box;
          "
        />

        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <button 
            id="api-key-save" 
            style="
              flex: 1;
              padding: 12px;
              background: linear-gradient(135deg, #00d4ff, #0099ff);
              color: #000;
              border: none;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
              font-size: 14px;
            "
          >
            Salvar Chave
          </button>
          <button 
            id="api-key-skip" 
            style="
              flex: 1;
              padding: 12px;
              background: #222;
              color: #aaa;
              border: 1px solid #333;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            "
          >
            Pular (Ler Docs)
          </button>
        </div>

        <p style="color: #666; font-size: 12px; margin: 16px 0 0;">
          📚 Obtenha sua chave em <strong style="color: #0099ff;">console.groq.com</strong>
        </p>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('api-key-save').addEventListener('click', () => {
      const input = document.getElementById('api-key-input').value.trim();
      if (this.setApiKey(input)) {
        modal.remove();
        location.reload(); // Recarregar para usar a chave
      } else {
        alert('❌ Chave inválida. Deve começar com "gsk_"');
      }
    });

    document.getElementById('api-key-skip').addEventListener('click', () => {
      modal.remove();
      console.log('⏭️  Modal fechado. Use setGroqKey(\'chave\') no console para configurar depois.');
    });
  }

  getStatus() {
    return {
      hasKey: !!this.apiKey,
      source: this.keySource,
      keyPreview: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'N/A'
    };
  }
}

// Inicializar globalmente
const apiConfig = new ApiConfig();
