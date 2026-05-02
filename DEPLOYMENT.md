# 🚀 Guia de Deployment — Black Void Studio

## Servidor de Testes (Recomendado: Vercel)

### ✅ Pré-requisitos
- Conta GitHub (seu código vai lá)
- Conta Vercel (deployment automático)
- Chave da API Groq (obtenha em console.groq.com)

---

## 📝 Passo 1: Preparar Repositório Git

```bash
# Inicializar git (se não tiver)
git init

# Verificar se .gitignore está protegendo os arquivos sensíveis
cat .gitignore
# Deve conter: .env, node_modules/, dist/

# Fazer commit
git add .
git commit -m "🔐 Black Void Studio - Seguro para Vercel"

# Adicionar ao GitHub
git remote add origin https://github.com/seu-usuario/black-void-studio.git
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 2: Deploy no Vercel

### Opção A: Via Dashboard Vercel (Mais Fácil)

1. Acesse https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório `black-void-studio`
4. Configure:
   - **Project Name:** `black-void-studio`
   - **Framework Preset:** "Other" ou "Static"
5. Vá para **Environment Variables** e adicione:
   ```
   Nome: VITE_GROQ_API_KEY
   Valor: gsk_sua_chave_real_aqui
   ```
6. Clique **Deploy**
7. ✅ Seu site estará em `https://black-void-studio.vercel.app`

### Opção B: Via CLI (Vercel Command Line)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Configurar variáveis
vercel env add VITE_GROQ_API_KEY
# Colar sua chave quando pedido

# Deploy em produção
vercel --prod
```

---

## 🔐 Variáveis de Ambiente no Vercel

**Dashboard Vercel → Settings → Environment Variables**

| Nome | Valor | Environments |
|------|-------|--------------|
| `VITE_GROQ_API_KEY` | `gsk_...` | Production, Preview, Development |

**Após adicionar:** Qualquer novo deploy carregará automaticamente.

---

## 🧪 Teste o Deploy

1. Abra seu site: `https://seu-site.vercel.app`
2. Abra o console (F12)
3. Teste o assistente digitando "oi" no chat
4. Deve responder normalmente

---

## 🐛 Troubleshooting

### "Assistente não responde"
```javascript
// No console:
checkGroqKey()
// Deve mostrar: ✅ Chave detectada: gsk_...
```

### "Erro 401 - Não autorizado"
- Chave inválida ou expirada
- Verificar em https://console.groq.com/keys
- Atualizar variável no Vercel

### "Página em branco"
- Verificar erros no console (F12)
- Verificar `vercel.json`
- Forçar reload: `Ctrl+Shift+R`

---

## 📊 Monitorar Deploy

**No Dashboard Vercel:**
- Logs de deploy
- Performance
- Analíticos
- Domain settings

---

## 🔄 Atualizações Futuras

```bash
# Fazer mudança no código
# ... editar arquivos ...

# Commit e push
git add .
git commit -m "✨ Nova feature"
git push origin main

# Vercel deploye AUTOMATICAMENTE
```

---

## 🎯 URLs Úteis

- 🌐 Site: `https://seu-site.vercel.app`
- 📊 Dashboard Vercel: https://vercel.com/dashboard
- 🔑 Chaves Groq: https://console.groq.com/keys
- 📖 Docs Groq: https://console.groq.com/docs
- 🆘 Support Vercel: https://vercel.com/support

---

## ✅ Checklist Final

- [ ] Git configurado e código no GitHub
- [ ] Projeto criado no Vercel
- [ ] Chave Groq configurada no Vercel
- [ ] Site acessível públicamente
- [ ] Assistente respondendo corretamente
- [ ] .env em .gitignore
- [ ] Nenhuma chave real no repositório

---

## 🎉 Pronto!

Seu projeto está online e seguro. O assistente de IA está pronto para ajudar clientes!
