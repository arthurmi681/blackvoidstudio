#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# BLACK VOID STUDIO — DEV SERVER
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Função para print formatado
print_header() {
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${MAGENTA}  🌑 BLACK VOID STUDIO — DEV SERVER ${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_section() {
  echo ""
  echo -e "${YELLOW}▸ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_info() {
  echo -e "${CYAN}ℹ${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Header
clear
print_header

# 1. Verificar .env
print_section "Configurando Ambiente"

if [ ! -f .env ]; then
  echo -e "${YELLOW}  → Criando .env${NC}"
  cat > .env << 'EOF'
# Variáveis de ambiente locais
# Obtenha sua chave em: https://console.groq.com/keys
VITE_GROQ_API_KEY=
EOF
  print_success ".env criado"
else
  print_success ".env encontrado"
fi

# 2. Verificar Node.js e Python (para HTTP server)
print_section "Verificando Dependências"

if command -v node &> /dev/null; then
  NODE_V=$(node --version)
  print_success "Node.js $NODE_V"
else
  print_info "Node.js não encontrado (opcional)"
fi

if command -v python3 &> /dev/null; then
  print_success "Python 3 ✓"
  PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
  print_success "Python ✓"
  PYTHON_CMD="python"
else
  print_error "Python não encontrado"
  exit 1
fi

# 3. Arquivos essenciais
print_section "Verificando Arquivos"

FILES=(
  "index.html"
  "main.js"
  "api-config.js"
  "agent/agent.js"
  "agent/config.json"
)

FILES_OK=true
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    print_success "$file"
  else
    print_error "$file (FALTANDO!)"
    FILES_OK=false
  fi
done

if [ "$FILES_OK" = false ]; then
  exit 1
fi

# 4. Iniciar servidor
print_section "Iniciando Servidor HTTP"

PORT=8000
URL="http://localhost:$PORT"

echo ""
echo -e "${WHITE}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${WHITE}│${CYAN}  Servidor rodando em:${NC}"
echo -e "${WHITE}│${GREEN}  $URL${NC}"
echo -e "${WHITE}│${NC}"
echo -e "${WHITE}│${CYAN}  Pressione CTRL+C para parar${NC}"
echo -e "${WHITE}└─────────────────────────────────────────────────────┘${NC}"

echo ""
echo -e "${MAGENTA}🚀 Abrindo navegador...${NC}"
sleep 1

# Tentar abrir no navegador
if command -v xdg-open &> /dev/null; then
  xdg-open "$URL" 2>/dev/null &
elif command -v open &> /dev/null; then
  open "$URL" 2>/dev/null &
else
  print_info "Abra manualmente: $URL"
fi

echo ""
print_header
echo ""

# Iniciar servidor Python
$PYTHON_CMD -m http.server $PORT --directory .
