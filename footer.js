document.addEventListener('DOMContentLoaded', function() {
    // 1. Estilos isolados do Footer e ajustes de Z-Index para o VLibras
    const footerStyles = `
    <style>
        #main-footer {
            background-color: var(--primary-blue);
            color: rgba(255,255,255,0.8);
            padding: 60px 20px;
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.1);
            margin-top: auto;
        }
        .footer-logos img { height: 60px; width: auto; transition: 0.3s; }
        .footer-links { margin-bottom: 30px; font-weight: 600; font-size: 0.9rem; }
        .footer-links a { color: white; text-decoration: none; margin: 0 15px; }
        .footer-links a:hover { color: var(--bright-cyan); }
        
        #card-lgpd {
            display: none; max-width: 750px; margin: 30px auto 0; padding: 30px;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px; text-align: left; color: white; backdrop-filter: blur(10px);
        }

        /* Ajuste para o VLibras não sobrepor elementos críticos */
        [vw] { 
            z-index: 999999 !important; 
            position: fixed !important; 
        }
    </style>
    `;

    // 2. Estrutura HTML do Footer + Estrutura do VLibras
    const footerHTML = `
    ${footerStyles}
    <footer id="main-footer">
        <div class="footer-logos">
            <a href="https://ufla.br" target="_blank">
                <img src="logo-ufla-branca.png" alt="UFLA">
            </a>
        </div>

        <div class="footer-links">
            <a href="index.html#como-funciona">Como Funciona</a>
            <span style="opacity: 0.3;">|</span>
            <a href="index.html#sobre">Objetivo</a>
            <span style="opacity: 0.3;">|</span>
            <a href="index.html#contato">Contato</a>
        </div>

        <p>&copy; 2026 <strong>IPÊ CONECT</strong>. Desenvolvido por <strong style="color: var(--bright-cyan);">Gabriel Fonseca</strong>.</p>

        <p style="margin-top: 15px;">
            <button id="btn-toggle-lgpd" style="background:none; border:none; color:inherit; cursor:pointer; text-decoration:underline;">
                Transparência e Proteção de Dados (LGPD)
            </button>
        </p>

        <div id="card-lgpd">
            <h3 style="color: var(--bright-cyan);">🛡️ Governança de Dados</h3>
            <p>O IPÊ CONECT atua pautado pela LGPD (Lei nº 13.709/2018). Dados de pesquisadores são oriundos da Plataforma Lattes.</p>
            <button id="btn-accept-lgpd" style="background:var(--bright-cyan); border:none; padding:10px 20px; cursor:pointer; font-weight:bold; margin-top:10px;">Entendi</button>
        </div>
    </footer>

    <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
    </div>
    `;

    // 3. Injeção no final do Body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 4. Inicialização do Script do VLibras
    const scriptVLibras = document.createElement('script');
    scriptVLibras.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    scriptVLibras.onload = () => {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.body.appendChild(scriptVLibras);

    // 5. Lógica do Card LGPD
    const card = document.getElementById('card-lgpd');
    const toggleBtn = document.getElementById('btn-toggle-lgpd');
    const acceptBtn = document.getElementById('btn-accept-lgpd');

    const toggleLGPD = () => {
        card.style.display = (card.style.display === 'block') ? 'none' : 'block';
    };

    toggleBtn.addEventListener('click', toggleLGPD);
    acceptBtn.addEventListener('click', toggleLGPD);
});
