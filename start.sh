#!/bin/bash

# Black Void Studio - Local Server Starter
# Este script inicia um servidor local para visualizar o site.

echo "🚀 Black Void Studio - Iniciando servidor local..."

# Tenta usar Python 3 (mais comum)
if command -v python3 &>/dev/null; then
    echo "✅ Usando Python 3 na porta 8080"
    echo "🔗 Acesse: http://localhost:8080"
    python3 -m http.server 8080
# Tenta usar Python 2
elif command -v python &>/dev/null; then
    echo "✅ Usando Python na porta 8080"
    echo "🔗 Acesse: http://localhost:8080"
    python -m SimpleHTTPServer 8080
# Tenta usar PHP
elif command -v php &>/dev/null; then
    echo "✅ Usando PHP na porta 8080"
    echo "🔗 Acesse: http://localhost:8080"
    php -S localhost:8080
else
    echo "❌ Erro: Nenhum servidor (Python ou PHP) encontrado."
    echo "Por favor, abra o arquivo index.html manualmente no seu navegador."
fi
