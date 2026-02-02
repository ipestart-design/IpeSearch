document.addEventListener('DOMContentLoaded', function() {
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

        /* Botão IA Estilizado */
        .btn-footer-ia {
            background: var(--gradient-tech);
            border: none;
            color: white;
            padding: 12px 25px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 20px rgba(0, 194, 203, 0.2);
            transition: 0.3s;
        }
        .btn-footer-ia:hover { transform: translateY(-3px); box-shadow: 0 15px 25px rgba(0, 194, 203, 0.4); }

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

        .dev-credit { font-size: 0.75rem; opacity: 0.5; }
        
        #card-lgpd {
            display: none; 
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            margin-top: 30px;
        }

        @media (max-width: 900px) {
            .footer-container { grid-template-columns: 1fr; text-align: center; }
            .footer-brand p { margin: 0 auto; }
            .footer-nav a:hover { transform: none; }
            .footer-bottom { justify-content: center; text-align: center; }
        }
    </style>
    `;

    const footerHTML = `
    ${footerStyles}
    <footer id="main-footer">
        <div class="footer-container">
            <div class="footer-brand">
                <img src="logo-ufla-branca.png" alt="UFLA">
                <p>O Ipê Conect é o ecossistema digital que une a excelência acadêmica da UFLA às demandas reais do mercado tecnológico.</p>
                <button class="btn-footer-ia" onclick="if(typeof toggleChat === 'function') toggleChat()">
                    <i class="fas fa-robot"></i> ASSISTENTE VIRTUAL
                </button>
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
            <p>&copy; 2026 IPÊ CONECT. Todos os direitos reservados.</p>
            <p class="dev-credit">Powered by Gabriel Fonseca - Bolsista IpêTech</p>
        </div>

        <div id="card-lgpd">
            <h3 style="color:var(--bright-cyan)">🛡️ Proteção de Dados</h3>
            <p style="font-size:0.85rem; opacity:0.8">Operamos sob a Lei 13.709/2018. Seus dados são usados exclusivamente para fins de conexão técnico-científica.</p>
            <button id="btn-accept-lgpd" style="margin-top:15px; background:var(--bright-cyan); border:none; padding:8px 20px; border-radius:5px; cursor:pointer; font-weight:bold;">FECHAR</button>
        </div>
    </footer>

    <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);

    const scriptVLibras = document.createElement('script');
    scriptVLibras.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    scriptVLibras.onload = () => { new window.VLibras.Widget('https://vlibras.gov.br/app'); };
    document.body.appendChild(scriptVLibras);

    const card = document.getElementById('card-lgpd');
    document.getElementById('btn-toggle-lgpd').onclick = () => card.style.display = 'block';
    document.getElementById('btn-accept-lgpd').onclick = () => card.style.display = 'none';
});
