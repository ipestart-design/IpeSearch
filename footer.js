document.addEventListener('DOMContentLoaded', function() {
    // 1. Estilos isolados do Footer
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

        .footer-logos {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 30px;
            margin-bottom: 30px;
        }

        .footer-logos img {
            height: 60px;
            width: auto;
            transition: transform 0.3s ease;
        }

        .footer-logos a:hover img {
            transform: scale(1.05);
            opacity: 1;
        }

        .footer-links {
            margin-bottom: 30px;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .footer-links a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
            transition: color 0.3s;
        }

        .footer-links a:hover {
            color: var(--bright-cyan);
        }

        .footer-copy { margin: 0; font-size: 0.95rem; }
        .footer-dev {
            margin-top: 10px;
            font-size: 0.75rem;
            opacity: 0.7;
            letter-spacing: 0.5px;
        }

        /* LGPD Card Style */
        #card-lgpd {
            display: none;
            max-width: 750px;
            margin: 30px auto 0 auto;
            padding: 30px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            text-align: left;
            color: white;
            line-height: 1.6;
            backdrop-filter: blur(10px);
            animation: fadeInFooter 0.4s ease;
        }

        .lgpd-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .lgpd-item { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; }
        
        .btn-lgpd-toggle {
            background: none; border: none; color: inherit;
            font-size: 0.8rem; text-decoration: underline;
            cursor: pointer; opacity: 0.6; transition: 0.3s;
        }

        .btn-lgpd-toggle:hover { color: var(--bright-cyan); opacity: 1; }

        .btn-lgpd-accept {
            background: var(--bright-cyan);
            border: none;
            color: var(--primary-blue);
            padding: 10px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: bold;
            transition: 0.3s;
        }

        .btn-lgpd-accept:hover { background: #00e5f0; transform: translateY(-2px); }

        @keyframes fadeInFooter {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
            .lgpd-grid { grid-template-columns: 1fr; }
            .footer-links a { display: block; margin: 10px 0; }
        }
    </style>
    `;

    // 2. Estrutura HTML do Footer
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

        <p class="footer-copy">
            &copy; 2026 <strong>IPÊ CONECT</strong>. Conectando a Universidade ao Mercado.
        </p>

        <p class="footer-dev">
            Desenvolvido por <strong style="color: var(--bright-cyan);">Gabriel Fonseca</strong> - Bolsista IpêTech/UFLA
        </p>

        <p style="margin-top: 15px;">
            <button class="btn-lgpd-toggle" id="btn-toggle-lgpd">
                Transparência e Proteção de Dados (LGPD)
            </button>
        </p>

        <div id="card-lgpd">
            <h3 style="color: var(--bright-cyan); margin-top: 0; font-size: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">🛡️ Transparência e Governança de Dados</h3>
            
            <p style="font-size: 0.9rem; margin-bottom: 15px;">
                O <strong>IPÊ CONECT</strong> é uma plataforma de interesse público que visa promover o capital intelectual da <strong>UFLA</strong>. Nossa atuação é pautada pela <strong>Lei nº 13.709/2018 (LGPD)</strong>.
            </p>

            <div class="lgpd-grid">
                <div class="lgpd-item">
                    <strong style="color: var(--bright-cyan); display: block; margin-bottom: 5px; font-size: 0.85rem;">FONTE E COLETA</strong>
                    <p style="font-size: 0.8rem; margin: 0; opacity: 0.9;">Dados públicos oficiais (Lattes/CNPq) e informações fornecidas pelo ecossistema de inovação.</p>
                </div>
                <div class="lgpd-item">
                    <strong style="color: var(--bright-cyan); display: block; margin-bottom: 5px; font-size: 0.85rem;">FINALIDADE</strong>
                    <p style="font-size: 0.8rem; margin: 0; opacity: 0.9;">Facilitar conexões para projetos de P&D+I e parcerias estratégicas.</p>
                </div>
            </div>

            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid var(--bright-cyan);">
                <p style="font-size: 0.85rem; margin: 0;">
                    <strong>Direitos do Titular:</strong> Solicite exclusão ou correção via: 
                    <a href="mailto:ipestart@ufla.br" style="color: var(--bright-cyan); font-weight: bold; text-decoration: none;">ipestart@ufla.br</a>.
                </p>
            </div>

            <div style="text-align: right; margin-top: 20px;">
                <button class="btn-lgpd-accept" id="btn-accept-lgpd">Entendi e Aceito</button>
            </div>
        </div>
    </footer>
    `;

    // 3. Injeção no final do Body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 4. Lógica do Card LGPD
    const card = document.getElementById('card-lgpd');
    const toggleBtn = document.getElementById('btn-toggle-lgpd');
    const acceptBtn = document.getElementById('btn-accept-lgpd');

    const toggleLGPD = () => {
        const isVisible = card.style.display === 'block';
        card.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) card.scrollIntoView({ behavior: 'smooth' });
    };

    toggleBtn.addEventListener('click', toggleLGPD);
    acceptBtn.addEventListener('click', toggleLGPD);
});
