document.addEventListener('DOMContentLoaded', function() {
    // 1. Estilos isolados do Footer e ajustes de Z-Index
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
        .footer-links { margin-bottom: 25px; font-weight: 600; font-size: 0.85rem; }
        .footer-links a { color: white; text-decoration: none; margin: 0 12px; transition: 0.3s; text-transform: uppercase; }
        .footer-links a:hover { color: var(--bright-cyan); }
        
        /* Card LGPD Detalhado */
        #card-lgpd {
            display: none; max-width: 800px; margin: 30px auto 0; padding: 35px;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 15px; text-align: left; color: white; backdrop-filter: blur(15px);
            line-height: 1.6; font-size: 0.9rem;
        }
        .lgpd-highlight { color: var(--bright-cyan); font-weight: 700; }
        .lgpd-section { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }

        [vw] { z-index: 999999 !important; position: fixed !important; }

        .btn-footer-ia {
            background: rgba(0, 194, 203, 0.1); border: 1px solid var(--bright-cyan);
            color: var(--bright-cyan); padding: 8px 15px; border-radius: 50px;
            cursor: pointer; font-weight: 700; margin-top: 20px; transition: 0.3s;
        }
        .btn-footer-ia:hover { background: var(--bright-cyan); color: var(--primary-blue); }
    </style>
    `;

    // 2. Estrutura HTML (Menus atualizados e Card LGPD completo)
    const footerHTML = `
    ${footerStyles}
    <footer id="main-footer">
        <div class="footer-logos" style="margin-bottom: 35px;">
            <a href="https://ufla.br" target="_blank">
                <img src="logo-ufla-branca.png" alt="UFLA">
            </a>
        </div>

        <div class="footer-links">
            <a href="index.html">Início</a>
            <a href="cadastro.html">Quero Participar</a>
            <a href="mentores.html">Mentores</a>
            <a href="desafios.html">Desafios</a>
            <a href="busca.html">Pesquisadores</a>
            <a href="busca-empresas.html">Empresas</a>
        </div>

        <p>&copy; 2026 <strong>IPÊ CONECT</strong>. Conectando Ciência e Mercado.</p>
        <p style="font-size: 0.75rem; opacity: 0.6; margin-top: 5px;">Desenvolvido por Gabriel Fonseca - Bolsista IpêTech/UFLA</p>

        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <button id="btn-toggle-lgpd" style="background:none; border:none; color:inherit; cursor:pointer; text-decoration:underline; font-size: 0.8rem; margin-top: 15px;">
                Transparência e Proteção de Dados (LGPD)
            </button>
            <button class="btn-footer-ia" onclick="if(typeof toggleChat === 'function') toggleChat()">
                <i class="fas fa-robot"></i> AJUDA DA IA
            </button>
        </div>

        <div id="card-lgpd">
            <div class="lgpd-section">
                <h3 class="lgpd-highlight">🛡️ Transparência e Governança de Dados</h3>
                <p>O <strong>IPÊ CONECT</strong> é uma plataforma de interesse público dedicada a fomentar a inovação. Nossa operação está em total conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;" class="lgpd-section">
                <div>
                    <span class="lgpd-highlight">FONTE DOS DADOS</span>
                    <p style="font-size: 0.8rem;">Dados de pesquisadores são extraídos de bases públicas oficiais (Plataforma Lattes/CNPq). Dados empresariais são fornecidos voluntariamente pelas organizações parceiras.</p>
                </div>
                <div>
                    <span class="lgpd-highlight">FINALIDADE</span>
                    <p style="font-size: 0.8rem;">Promover conexões técnico-científicas, facilitar parcerias de P&D+I e fortalecer o ecossistema de inovação da UFLA.</p>
                </div>
            </div>

            <div class="lgpd-section">
                <span class="lgpd-highlight">TRATAMENTO ÉTICO</span>
                <ul style="font-size: 0.8rem; margin-top: 10px;">
                    <li>Exibimos apenas dados profissionais e acadêmicos pertinentes.</li>
                    <li>É vedado o uso destas informações para fins de spam ou extração automatizada (scraping).</li>
                    <li>Garantimos ao titular o direito de retificação ou exclusão conforme o Art. 18 da LGPD.</li>
                </ul>
            </div>

            <p style="font-size: 0.8rem; opacity: 0.8;">Solicitações de privacidade: <a href="mailto:ipestart@ufla.br" style="color: var(--bright-cyan);">ipestart@ufla.br</a></p>
            
            <div style="text-align: right;">
                <button id="btn-accept-lgpd" style="background:var(--bright-cyan); border:none; padding:12px 25px; cursor:pointer; font-weight:bold; border-radius: 5px; color: var(--primary-blue);">CONCORDO E FECHAR</button>
            </div>
        </div>
    </footer>

    <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 4. Script VLibras
    const scriptVLibras = document.createElement('script');
    scriptVLibras.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    scriptVLibras.onload = () => { new window.VLibras.Widget('https://vlibras.gov.br/app'); };
    document.body.appendChild(scriptVLibras);

    // 5. Lógica LGPD
    const card = document.getElementById('card-lgpd');
    const toggleBtn = document.getElementById('btn-toggle-lgpd');
    const acceptBtn = document.getElementById('btn-accept-lgpd');

    const toggleLGPD = () => {
        const isVisible = card.style.display === 'block';
        card.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    toggleBtn.addEventListener('click', toggleLGPD);
    acceptBtn.addEventListener('click', toggleLGPD);
});
