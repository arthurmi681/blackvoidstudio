# 🔐 Guia de Segurança — API Keys

## ⚠️ CRÍTICO: Nunca commitar chaves reais

Seu projeto agora tem um sistema seguro para gerenciar chaves de API. **NUNCA** faça commit de chaves reais.

---

## 🚀 Como Usar

### Opção 1: Variáveis de Ambiente (RECOMENDADO - Vercel)

**No dashboard Vercel:**

1. Vá para seu projeto → **Settings** → **Environment Variables**
2. Crie uma nova variável:
   - Nome: `VITE_GROQ_API_KEY`
   - Valor: `gsk_sua_chave_aqui` (obtenha em console.groq.com)
   - Environments: Production, Preview, Development

3. Deploy — a chave será carregada automaticamente

**Por que é seguro:**
- Chave fica no servidor Vercel, não no repositório
- Não aparece em arquivos `.env`
- Cada deploy usa a chave atualizada

---

### Opção 2: Configurar no Navegador (Desenvolvimento Local)

**Abra o console do navegador (F12) e execute:**

```javascript
setGroqKey('gsk_sua_chave_aqui')
```

**Ou use a interface:** Um modal automático aparecerá se nenhuma chave for detectada.

**Verificar status:**
```javascript
checkGroqKey()
```

---

### Opção 3: Arquivo `.env` (Desenvolvimento)

1. Edite `.env`:
   ```
   VITE_GROQ_API_KEY=gsk_sua_chave_aqui
   ```

2. **NUNCA commitar este arquivo!** (`.gitignore` já tem configurado)

---

## 📋 Sistema de Carregamento (Ordem de Prioridade)

O `api-config.js` tenta carregar a chave nesta ordem:

1. **localStorage** — Chave salva no navegador (mais rápido)
2. **Variáveis de Ambiente** — Do servidor (mais seguro)
3. **Modal Interativo** — Pedir chave ao usuário

Se nenhuma for encontrada, um modal aparecerá pedindo a chave.

---

## 🧪 Testar Localmente (Seguro)

```bash
# No terminal, use uma chave FICTÍCIA para testes:
export VITE_GROQ_API_KEY=gsk_test_123456789

# Ou edite .env (será ignorado pelo git):
echo "VITE_GROQ_API_KEY=gsk_test_123456789" > .env
```

---

## ✅ Checklist Antes de Deploy

- [ ] `.env` está em `.gitignore`
- [ ] Nenhuma chave no arquivo `set_key.js`
- [ ] Variáveis de ambiente definidas no Vercel
- [ ] Testou localmente com `setGroqKey()` no console
- [ ] Assistente de IA respondendo corretamente

---

## 🐛 Troubleshooting

**"Nenhuma chave configurada"**
→ Execute `setGroqKey('sua_chave')` no console ou espere o modal

**"Chave inválida (não começa com gsk_)"**
→ Verifique em https://console.groq.com/keys

**"Assistente não responde"**
→ Chame `checkGroqKey()` no console para verificar

---

## 📚 Referências

- 🔑 Gerar chave: https://console.groq.com/keys
- 📖 Docs Groq: https://console.groq.com/docs
- 🚀 Deploy Vercel: https://vercel.com/docs/projects/environment-variables

