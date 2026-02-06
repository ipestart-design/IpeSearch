document.addEventListener('DOMContentLoaded', function() {
    const headerStyle = `
    <style>
        /* RESET GLOBAL DE SEGURANÇA */
        * { box-sizing: border-box; }
        
        html, body {
            max-width: 100%;
            overflow-x: hidden;
        }

        #main-header {
            background-color: #ffffff;
            height: 90px; /* Altura levemente reduzida para elegância */
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 5%;
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 2000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03); /* Sombra mais suave no header */
            transition: all 0.3s ease;
            font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        #main-header.scrolled { height: 70px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }

        /* LOGO */
        .logo-link { 
            display: flex !important; 
            align-items: center; 
            flex-shrink: 0; 
            min-width: 160px;
            text-decoration: none;
        }
        
        .logo-img { 
            height: 60px; 
            width: auto; 
            transition: all 0.3s ease; 
            display: block !important;
        }
        
        #main-header.scrolled .logo-img { height: 45px; }

        /* MENU CONTAINER */
        .nav-container { 
            display: flex; 
            align-items: center; 
            margin-left: auto; 
            gap: 40px; 
        }

        .nav-links { 
            display: flex; 
            gap: 35px; /* Espaçamento equilibrado */
            list-style: none; 
            align-items: center; 
            margin: 0; 
            padding: 0; 
        }

        .nav-links li a {
            color: #334155; /* Cinza escuro elegante */
            text-decoration: none; 
            font-weight: 600;
            font-size: 0.9rem; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
            white-space: nowrap;
            transition: color 0.2s;
            position: relative;
        }
        
        .nav-links li a:hover { color: #00c2cb; }

        /* --- BOTÃO PESQUISAR CORRIGIDO --- */
        .nav-dropdown { 
            position: relative; 
            display: flex; 
            align-items: center; 
        }

        .btn-pesquisa-header {
            background: linear-gradient(135deg, #00c2cb 0%, #00a0a8 100%); /* Gradiente sutil */
            color: white !important; 
            padding: 10px 24px; /* Tamanho mais refinado */
            border-radius: 50px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            font-size: 0.85rem; 
            font-weight: 700; /* Menos pesado que 800 */
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
            transition: all 0.3s ease;
            margin-left: 15px;
            box-shadow: 0 4px 12px rgba(0, 194, 203, 0.25); /* Sombra colorida (Glow) */
        }

        .btn-pesquisa-header:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 6px 16px rgba(0, 194, 203, 0.35);
        }
        
        .btn-pesquisa-header i { font-size: 0.9rem; }

        /* DROPDOWN MENU */
        .dropdown-menu {
            display: none; 
            position: absolute; 
            top: 120%; 
            right: 0; 
            background: white; 
            min-width: 200px; 
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            border-radius: 12px; 
            padding: 8px 0; 
            list-style: none;
            border: 1px solid #f1f5f9;
            z-index: 2100;
            animation: fadeInDrop 0.2s ease;
        }
        
        @keyframes fadeInDrop {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .nav-dropdown:hover .dropdown-menu { display: block; }

        .dropdown-menu li a {
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #334155 !important;
            text-transform: none !important;
            font-size: 0.9rem !important;
            font-weight: 500 !important;
            transition: 0.2s;
        }
        .dropdown-menu li a:hover { background: #f8fafc; color: #00c2cb !important; }

        /* MOBILE */
        .mobile-menu-btn {
            display: none; 
            font-size: 1.8rem; 
            color: #0f172a; 
            cursor: pointer; 
            background: none; 
            border: none; 
            margin-left: 15px;
            z-index: 2200;
        }

        .menu-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            z-index: 1999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .menu-overlay.active { display: block; opacity: 1; }

        @media (max-width: 1200px) {
            #main-header { height: 70px; padding: 0 20px; }
            .logo-img { height: 40px !important; }
            .mobile-menu-btn { display: block; }
            
            .nav-links {
                position: fixed; 
                top: 0; right: -100%; 
                width: 80%; max-width: 300px; height: 100vh; 
                background: white; 
                flex-direction: column; 
                padding: 80px 0;
                box-shadow: -5px 0 20px rgba(0,0,0,0.1); 
                transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                align-items: stretch;
                overflow-y: auto;
                z-index: 2100;
                gap: 0;
            }
            .nav-links.active { right: 0; }
            .nav-links > li > a { padding: 20px 30px; border-bottom: 1px solid #f1f5f9; display: block; }
            
            .nav-dropdown {
                display: block; width: 100%; padding: 20px 30px; border-bottom: 1px solid #f1f5f9;
            }
            .btn-pesquisa-header { margin: 0; width: 100%; justify-content: center; }
            .dropdown-menu {
                position: static; box-shadow: none; border: none; padding-top: 10px; display: block; opacity: 1; transform: none;
            }
        }
    </style>
    `;

    const headerHTML = `
    ${headerStyle}
    <div class="menu-overlay" id="menuOverlay"></div>
    <header id="main-header">
        <a href="index.html" class="logo-link">
            <img src="logo.png" alt="IPÊ CONECT" class="logo-img">
        </a>
        
        <div class="nav-container">
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html">Início</a></li>
                <li><a href="index.html#sobre">Nossa Missão</a></li>
                <li><a href="cadastro.html">Quero Participar</a></li>
                <li><a href="mentores.html">Mentores</a></li>
                <li><a href="central.html">Central de Soluções</a></li>
                <li><a href="index.html#contato">Fale Conosco</a></li>
                <li class="nav-dropdown">
                    <div class="btn-pesquisa-header">
                        <i class="fas fa-search"></i>
                        <span>Pesquisar</span>
                        <i class="fas fa-chevron-down" style="font-size: 0.7em; opacity: 0.8;"></i>
                    </div>
                    <ul class="dropdown-menu">
                        <li><a href="busca.html"><i class="fas fa-user-graduate"></i> Pesquisadores</a></li>
                        <li><a href="busca-empresas.html"><i class="fas fa-building"></i> Empresas</a></li>
                    </ul>
                </li>
            </ul>

            <button class="mobile-menu-btn" id="mobileBtn">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Lógica Mobile
    const mobileBtn = document.getElementById('mobileBtn');
    const navLinks = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if(navLinks.classList.contains('active')){
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    mobileBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Efeito Scroll
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
});
