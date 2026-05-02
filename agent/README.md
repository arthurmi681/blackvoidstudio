# VOID — Agent Integration para Black Void Studio

Integração do agente de IA com o painel assistant existente no seu site.

## 📦 Arquivos

### Para usar (necessário)
- **`integration.js`** — Lógica do agente integrada com o HTML existente
- **`styles.css`** — Estilos do painel assistant

### Alternativas (completo)
- **`agent.js`** — Core do agente com API OpenAI
- **`ui.js`** — Widget flutuante customizado
- **`config.json`** — Configurações centralizadas
- **`personality.md`** — Guia de personalidade

## 🚀 Como usar

### 1. Importar no `index.html`

Adicione antes de `</body>`, após `<script src="main.js"></script>`:

```html
<link rel="stylesheet" href="agent/styles.css"/>
<script src="agent/integration.js"></script>
```

**Pronto!** As funções `toggleAssistant()`, `sendMessage()` e `sendSuggestion()` já estão disponíveis.

## 🎯 Como funciona

O arquivo `integration.js` oferece:

- ✅ **Respostas pré-configuradas** para perguntas comuns
- ✅ **Integração perfeita** com seu HTML existente
- ✅ **Sem dependências externas**
- ✅ **Responsivo** em mobile
- ✅ **Dark theme** customizado

## 📝 Respostas configuradas

Adicione mais respostas editando a propriedade `responses` em `integration.js`:

```javascript
this.responses = {
  'palavra-chave': 'Sua resposta aqui',
  'outra-palavra': 'Outra resposta',
};
```

**Exemplo:** Se alguém digitar "quanto", "preco" ou "custa", receberá a resposta de preço.

## 🔧 Customização

### Mudar resposta genérica

Em `integration.js`, procure por `genericResponse` e edite:

```javascript
const genericResponse = `Sua resposta aqui...`;
```

### Adicionar delay antes de responder

```javascript
setTimeout(() => {
  this.addMessage(response, 'bot');
}, 500); // 500ms de delay
```

### Mudar tempo do loading

```javascript
setTimeout(() => {
  // ... resposta
}, 800); // Aumentar/diminuir 800
```

## 📱 Styles

O arquivo `styles.css` inclui:

- Animações suaves
- Responsivo mobile
- Dark theme
- Typing indicator
- Pulse notification

Customize cores em `styles.css`:

```css
/* Cor principal */
#assistant-av {
  background: linear-gradient(135deg, #c8ff00, #fff);
}

/* Mensagens do bot */
.assist-msg.bot span {
  border-left: 2px solid #c8ff00; /* Mudar cor */
}
```

## ✨ Features

| Feature | Status |
|---------|--------|
| Chat local (rápido) | ✅ Ativo |
| Respostas pré-configuradas | ✅ Ativo |
| Histórico de mensagens | ✅ Ativo |
| Loading indicator | ✅ Ativo |
| Sugestões clicáveis | ✅ Ativo |
| Responsive design | ✅ Ativo |
| Dark theme | ✅ Ativo |

---

**Made with ◇ by Black Void Studio**
