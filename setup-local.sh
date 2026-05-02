#!/bin/bash
# setup-local.sh — Setup rápido para testes locais

echo "🚀 Black Void Studio — Setup Local"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Verificar se .env existe
if [ ! -f .env ]; then
  echo "ℹ️  .env não encontrado. Criando..."
  cat > .env << EOF
# Variáveis de ambiente locais
# NUNCA commitar chaves reais aqui!
VITE_GROQ_API_KEY=
EOF
  echo "✅ .env criado"
else
  echo "✅ .env já existe"
fi

# 2. Verificar arquivos essenciais
echo ""
echo "📋 Verificando arquivos..."

FILES=(
  "index.html"
  "main.js"
  "api-config.js"
  "set_key.js"
  "agent/agent.js"
  "agent/config.json"
  "vercel.json"
  "SECURITY.md"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (FALTANDO!)"
  fi
done

# 3. Instruções finais
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Próximos passos:"
echo ""
echo "1️⃣  Obtenha sua chave em: https://console.groq.com/keys"
echo ""
echo "2️⃣  Opção A - Ambiente Local:"
echo "    → Abra index.html no navegador"
echo "    → Console (F12): setGroqKey('gsk_sua_chave')"
echo ""
echo "3️⃣  Opção B - Variáveis de Ambiente:"
echo "    → Edite .env: VITE_GROQ_API_KEY=gsk_sua_chave"
echo ""
echo "4️⃣  Opção C - Vercel (Recomendado):"
echo "    → Settings → Environment Variables"
echo "    → Nome: VITE_GROQ_API_KEY"
echo "    → Valor: gsk_sua_chave_real"
echo ""
echo "✅ Setup completo!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
