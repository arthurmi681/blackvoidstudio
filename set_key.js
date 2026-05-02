/**
 * Ferramenta para definir chave da API Groq em localStorage
 * USO: No console do navegador, execute:
 * setGroqKey('sua-chave-aqui')
 */

function setGroqKey(apiKey) {
  if (!apiKey || apiKey.trim().length === 0) {
    console.error('❌ Chave inválida');
    return false;
  }
  
  if (!apiKey.startsWith('gsk_')) {
    console.warn('⚠️  Aviso: Chave não começa com "gsk_". Verifique se está correta.');
  }
  
  localStorage.setItem("grok_key", apiKey);
  console.log('✅ Chave da API Groq definida com sucesso');
  console.log('💡 A IA do assistente agora pode responder mensagens');
  return true;
}

// DEBUG: Verificar se chave está configurada
function checkGroqKey() {
  const key = localStorage.getItem("grok_key");
  if (key) {
    console.log('✅ Chave detectada: ' + key.substring(0, 10) + '...');
  } else {
    console.log('❌ Nenhuma chave configurada. Use setGroqKey(\'sua-chave\')');
  }
}

// Auto-check ao carregar
checkGroqKey();
