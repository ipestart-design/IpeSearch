// ===== CHAT FLUTUANTE IPÊ ASSISTANT - INTEGRADO COM NETLIFY =====
document.addEventListener('DOMContentLoaded', function() {
    
    // HTML do Chat Widget
    const chatHTML = `
        <div id="chat-widget">
            <!-- Balão de Chamada (CTA) -->
            <div class="chat-cta" id="chatCta">
                <span class="cta-close" id="ctaClose">&times;</span>
                👋 Olá! Precisa de ajuda? Fale comigo!
            </div>

            <!-- Botão Principal -->
            <button id="chat-btn" aria-label="Abrir chat">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>

            <!-- Janela do Chat -->
            <div id="chat-window">
                <div class="chat-header">
                    <span>🤖 Ipê Assistant</span>
                    <button class="chat-close" id="chat-close">&times;</button>
                </div>
                
                <div id="chat-messages">
                    <div class="msg msg-ai">
                        Olá! Sou o Ipê Assistant 🌳<br>
                        Como posso ajudar você hoje?
                    </div>
                </div>
                
                <div class="chat-input-area">
                    <input 
                        type="text" 
                        id="chat-input" 
                        placeholder="Digite sua mensagem..."
                        autocomplete="off"
                    />
                    <button id="chat-send" disabled>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Inserir o chat no body
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // Elementos
    const chatBtn = document.getElementById('chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatCta = document.getElementById('chatCta');
    const ctaClose = document.getElementById('ctaClose');

    let chatOpen = false;
    let aguardandoResposta = false;

    // ===== MOSTRAR BALÃO CTA APÓS 5 SEGUNDOS =====
    setTimeout(() => {
        if (!chatOpen && localStorage.getItem('ctaClosed') !== 'true') {
            chatCta.style.display = 'block';
        }
    }, 5000);

    // Fechar o balão CTA
    ctaClose.addEventListener('click', (e) => {
        e.stopPropagation();
        chatCta.style.display = 'none';
        localStorage.setItem('ctaClosed', 'true');
    });

    // Clicar no balão abre o chat
    chatCta.addEventListener('click', () => {
        openChat();
        chatCta.style.display = 'none';
    });

    // ===== ABRIR/FECHAR CHAT =====
    function openChat() {
        chatWindow.style.display = 'flex';
        chatBtn.style.display = 'none';
        chatCta.style.display = 'none';
        chatOpen = true;
        chatInput.focus();
    }

    function closeChat() {
        chatWindow.style.display = 'none';
        chatBtn.style.display = 'flex';
        chatOpen = false;
    }

    chatBtn.addEventListener('click', openChat);
    chatClose.addEventListener('click', closeChat);

    // ===== HABILITAR/DESABILITAR BOTÃO ENVIAR =====
    chatInput.addEventListener('input', () => {
        if (aguardandoResposta) return;
        chatSend.disabled = chatInput.value.trim() === '';
    });

    // ===== ENVIAR MENSAGEM =====
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || aguardandoResposta) return;

        // Adicionar mensagem do usuário
        addMessage(text, 'user');
        chatInput.value = '';
        chatSend.disabled = true;
        aguardandoResposta = true;

        // Mostrar "digitando..."
        const typingDiv = addMessage('Digitando...', 'ai', true);

        try {
            // **CHAMADA PARA SUA FUNÇÃO NETLIFY**
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) {
                throw new Error('Erro na requisição');
            }

            const data = await response.json();
            
            // Remover "digitando..."
            if (typingDiv && typingDiv.parentNode) {
                typingDiv.remove();
            }

            // Adicionar resposta da IA (com suporte a HTML)
            addMessage(data.reply || 'Desculpe, não consegui processar sua mensagem.', 'ai');

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            
            // Remover "digitando..."
            if (typingDiv && typingDiv.parentNode) {
                typingDiv.remove();
            }

            addMessage('⚠️ Desculpe, ocorreu um erro. Tente novamente.', 'ai');
        } finally {
            aguardandoResposta = false;
            chatSend.disabled = chatInput.value.trim() === '';
        }
    }

    // Enviar ao clicar no botão
    chatSend.addEventListener('click', sendMessage);

    // Enviar ao pressionar Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !aguardandoResposta) {
            sendMessage();
        }
    });

    // ===== ADICIONAR MENSAGEM =====
    function addMessage(text, sender, isTyping = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg msg-${sender}`;
        
        // Se for mensagem da IA, permitir HTML (negrito, quebra de linha)
        if (sender === 'ai' && !isTyping) {
            msgDiv.innerHTML = text;
        } else {
            msgDiv.textContent = text;
        }
        
        if (isTyping) {
            msgDiv.style.fontStyle = 'italic';
            msgDiv.style.opacity = '0.7';
        }
        
        chatMessages.appendChild(msgDiv);
        
        // Scroll automático
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return msgDiv;
    }

    // ===== PREVENIR MÚLTIPLOS CLIQUES =====
    chatSend.addEventListener('click', (e) => {
        if (aguardandoResposta) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
});
