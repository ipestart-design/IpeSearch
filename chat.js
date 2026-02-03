// ===== CHAT FLUTUANTE IPÊ ASSISTANT - COMPLETO =====
// Recursos: Memória de sessão + Reconhecimento de voz + Integração Netlify + Supabase

document.addEventListener('DOMContentLoaded', function() {

    // ===== CONFIGURAÇÃO SUPABASE =====
    // Substitua 'SUA_ANON_KEY_AQUI' pela chave encontrada em Settings > API do seu Supabase
    const SUPABASE_URL = 'https://zfcoyirqxythradtiatn.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmY295aXJxeHl0aHJhZHRpYXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDU1OTMsImV4cCI6MjA4NTY4MTU5M30.akTDpUp4Sg25-1x77-xXLQ758MKHrAJ328LalYOq94U'; 
    
    let _supabase = null;
    if (window.supabase) {
        _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    
    // ===== HTML DO WIDGET =====
    const chatHTML = `
        <style>
            #chat-widget {
                position: fixed !important;
                bottom: 30px !important;
                right: 30px !important;
                z-index: 2147483646 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-end !important;
            }

            .chat-cta {
                background: white;
                padding: 12px 20px;
                border-radius: 50px;
                margin-bottom: 15px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                font-size: 13px;
                border: 1px solid #eee;
                color: #003366;
                display: none;
                animation: flutuar 3s infinite ease-in-out;
                font-family: 'Segoe UI', sans-serif;
            }

            @keyframes flutuar {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }

            .btn-ia-flutuante {
                width: 70px !important;
                height: 70px !important;
                border-radius: 50% !important;
               background: linear-gradient(135deg, #003366, #00c2cb) !important;
                color: white !important;
                border: 3px solid white !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4) !important;
      0         font-size: 28px !important;
                transition: transform 0.3s ease !important;
            }

            .btn-ia-flutuante:hover {
                transform: scale(1.1) !important;
            }

            #chat-window {
                position: fixed;
                bottom: 110px;
                right: 30px;
  0             width: 360px;
                height: 520px;
                background: white;
      0         border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.25);
                display: none;
      0         flex-direction: column;
                overflow: hidden;
                z-index: 2147483646;
      0         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .chat-header {
      0         background: #003366;
                color: white;
      0         padding: 18px;
                display: flex;
      0         justify-content: space-between;
                align-items: center;
      0         font-weight: 700;
                font-size: 1rem;
            }

            .chat-close {
      0         background: none;
                border: none;
      0         color: white;
              0 cursor: pointer;
                font-size: 24px;
              0 line-height: 1;
      0         padding: 0;
              0 transition: transform 0.2s;
            }

            .chat-close:hover {
      0         transform: rotate(90deg);
            }

            #chat-messages {
      0         flex: 1;
                padding: 15px;
      0         overflow-y: auto;
                background: #f4f6f9;
      0         display: flex;
                flex-direction: column;
      0         gap: 12px;
                font-size: 14px;
            }

            .msg {
      0         padding: 12px 15px;
                border-radius: 12px;
      0         max-width: 85%;
                line-height: 1.5;
      0         word-wrap: break-word;
            }

            .msg-user {
      0         align-self: flex-end;
                background: #00c2cb;
      0         color: white;
              0 border-bottom-right-radius: 4px;
            }

            .msg-ai {
      0         align-self: flex-start;
                background: white;
      0         color: #333;
      0         border: 1px solid #e0e6ed;
      0         border-bottom-left-radius: 4px;
            }

            .msg-ai strong, .msg-ai b {
      0         color: #003366;
                font-weight: 700;
            }

            .typing-indicator {
      0         align-self: flex-start;
                background: white;
      0         border: 1px solid #e0e6ed;
      0         padding: 12px 15px;
      0         border-radius: 12px;
      0         font-style: italic;
              0 opacity: 0.7;
      0         animation: pulse 1.5s infinite;
            }

            @keyframes pulse {
      0         0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }

            .chat-input-area {
      0         padding: 15px;
                border-top: 1px solid #e0e6ed;
      0         display: flex;
              0 gap: 10px;
      0         background: white;
              0 align-items: center;
            }

            #chat-input {
      0         flex: 1;
                padding: 12px 15px;
      0         border: 1px solid #ddd;
      0         border-radius: 24px;
      0         outline: none;
      0         font-size: 14px;
      0         transition: border-color 0.2s;
      0         font-family: inherit;
            }

            #chat-input:focus {
      0         border-color: #00c2cb;
            }

            .chat-btn {
      0         background: none;
                border: none;
      0         color: #003366;
      0         cursor: pointer;
     0         font-size: 20px;
      0         padding: 8px;
      0         display: flex;
      0         align-items: center;
      0         justify-content: center;
      0         transition: all 0.2s;
     0         border-radius: 50%;
      0         width: 40px;
     0         height: 40px;
            }

            .chat-btn:hover:not(:disabled) {
      0         background: #f0f4f8;
      0         transform: scale(1.1);
            }

            .chat-btn:disabled {
      0         opacity: 0.4;
      0         cursor: not-allowed;
            }

            .chat-btn.recording {
      0         color: #dc3545;
      0         animation: pulse-red 1s infinite;
            }

            @keyframes pulse-red {
      0         0%, 100% { opacity: 1; }
               50% { opacity: 0.6; }
            }

            #chat-send {
      0         background: #00c2cb;
               color: white;
            }

            #chat-send:hover:not(:disabled) {
      0         background: #00a9b0;
            }

            /* Mobile */
      0     @media (max-width: 480px) {
                #chat-window {
      0             width: calc(100vw - 20px);
      0             height: calc(100vh - 120px);
      0             right: 10px;
      0             bottom: 90px;
                }
                
                #chat-widget {
      0             right: 15px;
      0             bottom: 15px;
                }
            }
        </style>

        <div id="chat-widget">
            <div class="chat-cta" id="chatCta">
                👋 Dúvidas? <strong>Fale com a IA!</strong>
            </div>
            
            <button class="btn-ia-flutuante" id="chatBtn" aria-label="Abrir chat">
                <i class="fas fa-robot"></i>
            </button>
        </div>

        <div id="chat-window">
            <div class="chat-header">
                <span>🤖 Ipê Assistant</span>
                <button class="chat-close" id="chatClose">&times;</button>
            </div>
            
            <div id="chat-messages">
                <div class="msg msg-ai">
                    Olá! 👋 Sou o <strong>Ipê Assistant</strong>.<br>
                    Como posso ajudar você hoje?
                </div>
            </div>
            
            <div class="chat-input-area">
                <button class="chat-btn" id="voiceBtn" title="Gravar áudio">
                    <i class="fas fa-microphone"></i>
                </button>
                <input 
                    type="text" 
                    id="chat-input" 
                    placeholder="Digite ou grave sua mensagem..."
                    autocomplete="off"
                />
                <button class="chat-btn" id="chat-send" disabled title="Enviar">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // ===== ELEMENTOS =====
    const chatWidget = document.getElementById('chat-widget');
    const chatBtn = document.getElementById('chatBtn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatCta = document.getElementById('chatCta');
    const voiceBtn = document.getElementById('voiceBtn');

    // ===== VARIÁVEIS DE ESTADO =====
    let chatOpen = false;
    let aguardandoResposta = false;
    let historicoConversa = []; // Memória da sessão
    let recognition = null;
    let isRecording = false;

    // ===== INICIALIZAR RECONHECIMENTO DE VOZ =====
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            chatSend.disabled = false;
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };

        recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            if (event.error === 'no-speech') {
                addMessage('Não consegui captar nenhum áudio. Tente novamente.', 'ai');
            }
        };

        recognition.onend = () => {
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };
    } else {
        voiceBtn.style.display = 'none';
    }

    // ===== MOSTRAR BALÃO CTA APÓS 5s =====
    setTimeout(() => {
        if (!chatOpen && !localStorage.getItem('ctaClosed')) {
            chatCta.style.display = 'block';
        }
    }, 5000);

    // ===== EVENTOS =====
    chatBtn.addEventListener('click', openChat);
    chatClose.addEventListener('click', closeChat);
    chatCta.addEventListener('click', () => {
        openChat();
        chatCta.style.display = 'none';
        localStorage.setItem('ctaClosed', 'true');
    });

    voiceBtn.addEventListener('click', toggleVoiceRecording);

    chatInput.addEventListener('input', () => {
        if (!aguardandoResposta) {
            chatSend.disabled = chatInput.value.trim() === '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !aguardandoResposta) {
            sendMessage();
        }
    });

    chatSend.addEventListener('click', sendMessage);

    // ===== FUNÇÕES =====
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

    function toggleVoiceRecording() {
        if (!recognition) return;

        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
            isRecording = true;
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        }
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || aguardandoResposta) return;

        // Adicionar à interface
        addMessage(text, 'user');
        chatInput.value = '';
        chatSend.disabled = true;
        aguardandoResposta = true;

        // Adicionar ao histórico
        historicoConversa.push({ role: 'user', content: text });

        // Mostrar "digitando..."
        const typingDiv = addTypingIndicator();

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text,
                    history: historicoConversa
                })
            });

            if (!response.ok) throw new Error('Erro na requisição');

            const data = await response.json();
            
            // Remover "digitando..."
            if (typingDiv && typingDiv.parentNode) {
                typingDiv.remove();
            }

            const reply = data.reply || 'Desculpe, não consegui processar sua mensagem.';
            
            // Adicionar resposta
            addMessage(reply, 'ai');
            
            // Adicionar ao histórico
            historicoConversa.push({ role: 'assistant', content: reply });

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            
            if (typingDiv && typingDiv.parentNode) {
                typingDiv.remove();
            }

            addMessage('⚠️ Desculpe, ocorreu um erro. Tente novamente.', 'ai');
        } finally {
            aguardandoResposta = false;
            chatSend.disabled = chatInput.value.trim() === '';
        }
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg msg-${sender}`;
        
        // Se for mensagem da IA, permitir HTML
        if (sender === 'ai') {
            msgDiv.innerHTML = text;
        } else {
            msgDiv.textContent = text;
        }
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return msgDiv;
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.textContent = 'Digitando...';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }
});
