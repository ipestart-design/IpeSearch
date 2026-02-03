// ===== CHAT FLUTUANTE IPÊ ASSISTANT - COMPLETO =====
// Recursos: Memória de sessão + Reconhecimento de voz + Integração Netlify + Supabase Unificado

document.addEventListener('DOMContentLoaded', function() {

    // ===== CONFIGURAÇÃO SUPABASE UNIFICADA (PROTEÇÃO TOTAL) =====
    const SUPABASE_URL = 'https://zfcoyirqxythradtiatn.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmY295aXJxeHl0aHJhZHRpYXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDU1OTMsImV4cCI6MjA4NTY4MTU5M30.akTDpUp4Sg25-1x77-xXLQ758MKHrAJ328LalYOq94U'; 

    let _supabase = null;

    // Só inicializa se o SDK do Supabase estiver no HTML e se ainda não houver instância
    if (typeof supabase !== 'undefined') {
        if (!window.supabaseClientInstance) {
            window.supabaseClientInstance = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        _supabase = window.supabaseClientInstance;
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
                font-size: 28px !important;
                transition: transform 0.3s ease !important;
            }
            .btn-ia-flutuante:hover { transform: scale(1.1) !important; }
            #chat-window {
                position: fixed;
                bottom: 110px;
                right: 30px;
                width: 360px;
                height: 520px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.25);
                display: none;
                flex-direction: column;
                overflow: hidden;
                z-index: 2147483646;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .chat-header {
                background: #003366;
                color: white;
                padding: 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 700;
                font-size: 1rem;
            }
            .chat-close {
                background: none; border: none; color: white;
                cursor: pointer; font-size: 24px; line-height: 1; padding: 0;
                transition: transform 0.2s;
            }
            .chat-close:hover { transform: rotate(90deg); }
            #chat-messages {
                flex: 1; padding: 15px; overflow-y: auto; background: #f4f6f9;
                display: flex; flex-direction: column; gap: 12px; font-size: 14px;
            }
            .msg { padding: 12px 15px; border-radius: 12px; max-width: 85%; line-height: 1.5; word-wrap: break-word; }
            .msg-user { align-self: flex-end; background: #00c2cb; color: white; border-bottom-right-radius: 4px; }
            .msg-ai { align-self: flex-start; background: white; color: #333; border: 1px solid #e0e6ed; border-bottom-left-radius: 4px; }
            .msg-ai strong, .msg-ai b { color: #003366; font-weight: 700; }
            .typing-indicator { align-self: flex-start; background: white; border: 1px solid #e0e6ed; padding: 12px 15px; border-radius: 12px; font-style: italic; opacity: 0.7; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            .chat-input-area { padding: 15px; border-top: 1px solid #e0e6ed; display: flex; gap: 10px; background: white; align-items: center; }
            #chat-input { flex: 1; padding: 12px 15px; border: 1px solid #ddd; border-radius: 24px; outline: none; font-size: 14px; transition: border-color 0.2s; font-family: inherit; }
            #chat-input:focus { border-color: #00c2cb; }
            .chat-btn { background: none; border: none; color: #003366; cursor: pointer; font-size: 20px; padding: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border-radius: 50%; width: 40px; height: 40px; }
            .chat-btn:hover:not(:disabled) { background: #f0f4f8; transform: scale(1.1); }
            .chat-btn:disabled { opacity: 0.4; cursor: not-allowed; }
            .chat-btn.recording { color: #dc3545; animation: pulse-red 1s infinite; }
            @keyframes pulse-red { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
            #chat-send { background: #00c2cb; color: white; }
            #chat-send:hover:not(:disabled) { background: #00a9b0; }
            @media (max-width: 480px) {
                #chat-window { width: calc(100vw - 20px); height: calc(100vh - 120px); right: 10px; bottom: 90px; }
                #chat-widget { right: 15px; bottom: 15px; }
            }
        </style>
        <div id="chat-widget">
            <div class="chat-cta" id="chatCta"> 👋 Dúvidas? <strong>Fale com a IA!</strong> </div>
            <button class="btn-ia-flutuante" id="chatBtn" aria-label="Abrir chat"> <i class="fas fa-robot"></i> </button>
        </div>
        <div id="chat-window">
            <div class="chat-header"> <span>🤖 Ipê Assistant</span> <button class="chat-close" id="chatClose">&times;</button> </div>
            <div id="chat-messages">
                <div class="msg msg-ai"> Olá! 👋 Sou o <strong>Ipê Assistant</strong>.<br> Como posso ajudar você hoje? </div>
            </div>
            <div class="chat-input-area">
                <button class="chat-btn" id="voiceBtn" title="Gravar áudio"> <i class="fas fa-microphone"></i> </button>
                <input type="text" id="chat-input" placeholder="Digite ou grave sua mensagem..." autocomplete="off" />
                <button class="chat-btn" id="chat-send" disabled title="Enviar"> <i class="fas fa-paper-plane"></i> </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatBtn = document.getElementById('chatBtn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatCta = document.getElementById('chatCta');
    const voiceBtn = document.getElementById('voiceBtn');

    let chatOpen = false;
    let aguardandoResposta = false;
    let historicoConversa = []; 
    let recognition = null;
    let isRecording = false;

    // Inicializar reconhecimento de voz com segurança
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.onresult = (event) => {
            chatInput.value = event.results[0][0].transcript;
            chatSend.disabled = false;
            stopRecording();
        };
        recognition.onerror = () => stopRecording();
        recognition.onend = () => stopRecording();
    } else {
        voiceBtn.style.display = 'none';
    }

    setTimeout(() => {
        if (!chatOpen && !localStorage.getItem('ctaClosed')) {
            chatCta.style.display = 'block';
        }
    }, 5000);

    chatBtn.onclick = openChat;
    chatClose.onclick = closeChat;
    chatCta.onclick = openChat;
    voiceBtn.onclick = toggleVoiceRecording;
    chatInput.oninput = () => chatSend.disabled = chatInput.value.trim() === '';
    chatInput.onkeypress = (e) => { if (e.key === 'Enter' && !aguardandoResposta) sendMessage(); };
    chatSend.onclick = sendMessage;

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

    function stopRecording() {
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || aguardandoResposta) return;

        addMessage(text, 'user');
        chatInput.value = '';
        chatSend.disabled = true;
        aguardandoResposta = true;
        historicoConversa.push({ role: 'user', content: text });

        const typingDiv = addTypingIndicator();

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: historicoConversa })
            });

            const data = await response.json();
            typingDiv.remove();
            addMessage(data.reply || 'Desculpe, não consegui processar.', 'ai');
            historicoConversa.push({ role: 'assistant', content: data.reply });
        } catch (error) {
            if(typingDiv) typingDiv.remove();
            addMessage('⚠️ Erro ao conectar com a IA.', 'ai');
        } finally {
            aguardandoResposta = false;
        }
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg msg-${sender}`;
        msgDiv.innerHTML = sender === 'ai' ? text : text.replace(/</g, "&lt;");
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
