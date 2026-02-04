document.addEventListener('DOMContentLoaded', function() {
    // 1. Estilos modernos com Glassmorphism, Assinatura e Card Jurídico
    const footerStyles = `
    <style>
        #main-footer {
            background: linear-gradient(to bottom, #003366, #002244);
            color: #ffffff;
            padding: 80px 5% 40px;
            font-family: 'Segoe UI', Roboto, sans-serif;
            position: relative;
            overflow: hidden;
        }

        /* Elemento Decorativo de Fundo */
        #main-footer::before {
            content: "";
            position: absolute;
            top: -50px; left: -50px;
            width: 200px; height: 200px;
            background: rgba(0, 194, 203, 0.05);
            border-radius: 50%;
            filter: blur(50px);
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr;
            gap: 40px;
            text-align: left;
        }

        /* --- EFEITO DE HOVER NA LOGO (ATUALIZADO) --- */
        .footer-brand a { 
            text-decoration: none; 
            display: inline-block; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Efeito elástico suave */
        }
        
        .footer-brand a:hover { 
            transform: scale(1.1); /* Aumenta 10% */
            filter: drop-shadow(0 0 15px rgba(0, 194, 203, 0.6)); /* Brilho Ciano */
        }

        .footer-brand img { height: 70px; margin-bottom: 20px; filter: brightness(0) invert(1); }
        .footer-brand p { font-size: 0.9rem; opacity: 0.7; line-height: 1.6; max-width: 300px; }

        .footer-column h4 {
            color: var(--bright-cyan);
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 25px;
            font-weight: 800;
        }

        .footer-nav { list-style: none; padding: 0; }
        .footer-nav li { margin-bottom: 12px; }
        .footer-nav a { 
            color: rgba(255,255,255,0.7); 
            text-decoration: none; 
            font-weight: 600; 
            transition: 0.3s;
            display: inline-block;
        }
        .footer-nav a:hover { color: white; transform: translateX(5px); }

        /* --- DESTAQUE DA ASSINATURA --- */
        .footer-bottom {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .signature-container {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.05);
            padding: 10px 24px;
            border-radius: 50px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: 0.3s ease;
        }

        .signature-container:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--bright-cyan);
            transform: translateY(-2px);
        }

        .signature-details {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
        }

        .signature-text {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: rgba(255,255,255,0.5);
        }

        .signature-name {
            font-size: 0.9rem;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 0.5px;
        }

        /* --- CARD JURÍDICO LGPD --- */
        #card-lgpd {
            display: none; 
            position: relative;
            max-width: 900px; 
            margin: 40px auto 0; 
            padding: 45px;
            background: rgba(255, 255, 255, 0.07); 
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 24px; 
            text-align: left; 
            color: #ffffff; 
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.4);
            line-height: 1.8;
            animation: fadeInLGPD 0.4s ease-out;
        }

        @keyframes fadeInLGPD {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .lgpd-header { border-bottom: 2px solid var(--bright-cyan); padding-bottom: 15px; margin-bottom: 25px; }
        .lgpd-header h3 { font-size: 1.5rem; color: var(--bright-cyan); text-transform: uppercase; letter-spacing: 1px; margin: 0; }

        .lgpd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; }
        
        .lgpd-item h4 { color: var(--bright-cyan); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
        .lgpd-item p { font-size: 0.9rem; opacity: 0.9; margin: 0; }

        .legal-notice { 
            background: rgba(0, 0, 0, 0.2); 
            padding: 20px; 
            border-radius: 12px; 
            font-size: 0.85rem; 
            border-left: 4px solid var(--bright-cyan); 
            margin-top: 20px;
        }

        .btn-close-lgpd {
            background: var(--bright-cyan); 
            color: #003366; 
            border: none; 
            padding: 12px 35px; 
            border-radius: 50px; 
            font-weight: 800; 
            cursor: pointer; 
            text-transform: uppercase; 
            transition: 0.3s;
        }
        .btn-close-lgpd:hover { transform: scale(1.05); background: #ffffff; }

        /* VLibras Fix */
        [vw] { z-index: 2147483647 !important; position: fixed !important; }

        @media (max-width: 900px) {
            .footer-container { grid-template-columns: 1fr; text-align: center; }
            .footer-brand p { margin: 0 auto; }
            .footer-bottom { justify-content: center; flex-direction: column; text-align: center; }
            .lgpd-grid { grid-template-columns: 1fr; }
        }
    </style>
    `;

    // 2. Estrutura HTML
    const footerHTML = `
    ${footerStyles}
    <footer id="main-footer">
        <div class="footer-container">
            <div class="footer-brand">
                <a href="https://ufla.br" target="_blank" title="Ir para o site oficial da UFLA">
                    <img src="logo-ufla-branca.png" alt="UFLA">
                </a>
                <p>O Ipê Conect é o ecossistema digital que une a excelência acadêmica da UFLA às demandas reais do mercado tecnológico.</p>
            </div>

            <div class="footer-column">
                <h4>Navegação</h4>
                <ul class="footer-nav">
                    <li><a href="index.html">Início</a></li>
                    <li><a href="index.html#sobre">Nossa Missão</a></li>
                    <li><a href="mentores.html">Mentores</a></li>
                    <li><a href="desafios.html">Desafios</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4>Oportunidades</h4>
                <ul class="footer-nav">
                    <li><a href="cadastro.html">Quero Participar</a></li>
                    <li><a href="busca.html">Pesquisadores</a></li>
                    <li><a href="busca-empresas.html">Empresas</a></li>
                    <li><a href="#" id="btn-toggle-lgpd">Privacidade (LGPD)</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p style="opacity: 0.7; font-size: 0.9rem;">&copy; 2026 IPÊ CONECT. Todos os direitos reservados.</p>
            
            <div class="signature-container">
                <i class="fas fa-code" style="color: var(--bright-cyan); font-size: 1.2rem;"></i>
                <div class="signature-details">
                    <span class="signature-text">Desenvolvido por</span>
                    <span class="signature-name">GABRIEL FONSECA • BOLSISTA IPÊTECH</span>
                </div>
            </div>
        </div>

        <div id="card-lgpd">
            <div class="lgpd-header">
                <h3>🛡️ Termos de Uso e Governança de Dados</h3>
            </div>

            <div class="lgpd-grid">
                <div class="lgpd-item">
                    <h4>1. Natureza da Plataforma</h4>
                    <p>O IPÊ CONECT é uma plataforma de interesse público científico, atuando como um catálogo de competências para fins de inovação tecnológica e parcerias institucionais.</p>
                </div>
                <div class="lgpd-item">
                    <h4>2. Fonte e Coleta de Dados</h4>
                    <p>Os dados de pesquisadores são provenientes da <strong>Plataforma Lattes (CNPq)</strong>, base pública de acesso aberto. Dados empresariais são coletados via consentimento direto (Art. 7º, I, LGPD).</p>
                </div>
            </div>

            <div class="lgpd-grid">
                <div class="lgpd-item">
                    <h4>3. Base Legal (LGPD)</h4>
                    <p>O tratamento de dados fundamenta-se no <strong>Art. 7º, inciso V</strong> (execução de contrato/parcerias) e <strong>inciso IX</strong> (legítimo interesse do controlador) da Lei 13.709/2018.</p>
                </div>
                <div class="lgpd-item">
                    <h4>4. Direitos do Titular</h4>
                    <p>Em conformidade com o <strong>Art. 18 da LGPD</strong>, é garantido ao titular o direito de acesso, correção ou exclusão de seu perfil mediante solicitação via e-mail oficial.</p>
                </div>
            </div>

            <div class="legal-notice">
                <strong>AVISO DE RESPONSABILIDADE:</strong> É estritamente proibida a extração automatizada de dados (scraping) para fins comerciais ou marketing direto sem autorização prévia. O uso indevido sujeitará o infrator às sanções previstas em lei.
            </div>

            <div style="margin-top: 30px; overflow: hidden; display: flex; justify-content: space-between; align-items: center;">
                <p style="font-size: 0.8rem; opacity: 0.7; margin: 0;">Contato: <a href="mailto:ipestart@ufla.br" style="color:var(--bright-cyan)">ipestart@ufla.br</a></p>
                <button class="btn-close-lgpd" id="btn-accept-lgpd">Entendi e Aceito</button>
            </div>
        </div>
    </footer>

    <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 3. Script VLibras
    const scriptVLibras = document.createElement('script');
    scriptVLibras.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    scriptVLibras.onload = () => { new window.VLibras.Widget('https://vlibras.gov.br/app'); };
    document.body.appendChild(scriptVLibras);

    // 4. Lógica do Card Jurídico LGPD
    const card = document.getElementById('card-lgpd');
    const toggleBtn = document.getElementById('btn-toggle-lgpd');
    const acceptBtn = document.getElementById('btn-accept-lgpd');

    if(toggleBtn && card) {
        toggleBtn.onclick = (e) => {
            e.preventDefault();
            card.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        acceptBtn.onclick = () => {
            card.style.display = 'none';
        };
    }
});
