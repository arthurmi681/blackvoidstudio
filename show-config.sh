#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# BLACK VOID STUDIO — DISPLAY CONFIG (Visual para vídeo)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Cores
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear

echo -e "${MAGENTA}"
cat << "EOF"
  ███╗   ███╗███████╗███╗   ███╗ █████╗ ███╗   ███╗
  ████╗ ████║██╔════╝████╗ ████║██╔══██╗████╗ ████║
  ██╔████╔██║█████╗  ██╔████╔██║███████║██╔████╔██║
  ██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██╔══██║██║╚██╔╝██║
  ██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║██║  ██║██║ ╚═╝ ██║
  ╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
EOF
echo -e "${NC}"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}   BLACK VOID STUDIO — Project Memory Display${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Arquivos do projeto
echo -e "${YELLOW}📁 Project Files:${NC}"
echo ""
ls -lh *.js *.html *.css .env 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'
echo ""

# Estrutura
echo -e "${YELLOW}📂 Folders:${NC}"
echo -e "   ${GREEN}agent/${NC} - AI Agent system"
echo -e "   ${GREEN}img/${NC}   - Image assets"
echo ""

# Config
echo -e "${YELLOW}⚙️  Configuration:${NC}"
echo ""
if [ -f .env ]; then
  echo -e "   ${GREEN}✓${NC} .env exists"
  if grep -q "VITE_GROQ_API_KEY" .env; then
    if grep "VITE_GROQ_API_KEY=gsk_" .env > /dev/null 2>&1; then
      echo -e "   ${GREEN}✓${NC} GROQ API key configured"
    else
      echo -e "   ${YELLOW}⚠${NC}  GROQ API key empty"
    fi
  fi
fi

echo -e "   ${GREEN}✓${NC} Agent config ready"
echo ""

# Commands
echo -e "${YELLOW}🚀 Quick Commands:${NC}"
echo ""
echo -e "   ${CYAN}bash run-dev.sh${NC}"
echo -e "   Start HTTP server + open in browser"
echo ""
echo -e "   ${CYAN}python3 -m http.server 8000${NC}"
echo -e "   Start simple HTTP server on port 8000"
echo ""
echo -e "   ${CYAN}node set_key.js${NC}"
echo -e "   Configure API key"
echo ""

# Tech Stack
echo -e "${YELLOW}🛠️  Tech Stack:${NC}"
echo ""
echo -e "   ${GREEN}•${NC} Vanilla JavaScript (ES6+)"
echo -e "   ${GREEN}•${NC} Groq API (LLaMA 3 70B)"
echo -e "   ${GREEN}•${NC} CSS Animations"
echo -e "   ${GREEN}•${NC} Custom AI Agent"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
