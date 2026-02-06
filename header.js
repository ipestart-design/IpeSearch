document.addEventListener('DOMContentLoaded', function() {
    const headerStyle = `
    <style>
        /* RESET & BASE */
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; width: 100%; }

        /* HEADER FIXO */
        #main-header {
            background-color: rgba(255, 255, 255, 0.98); /* Quase 100% opaco para leitura */
            backdrop-filter: blur(12px);
            height: 90px; 
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 5%;
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 2000;
            box-shadow: 0 2px 20px rgba(0,0,0,0.03);
            transition: height 0.3s ease, box-shadow 0.3s ease;
            font-family: 'Inter', sans-serif;
        }

        /* AJUSTE SCROLL (Sutil, não esmaga a logo) */
        #main-header.scrolled { 
            height: 80px; /* Reduz pouco */
            box-shadow: 0 4px 15px rgba(0,0,0,0.08); 
        }

        /* LOGO */
        .logo-link { 
            text-decoration: none; 
            display: flex; 
            align-items: center;
            height: 100%; /* Garante alinhamento */
        }
        
        .logo-img { 
            height: 60px; /* Tamanho original grande */
            width: auto; 
            transition: height 0.3s ease; 
            display: block;
        }
        
        /* Logo no Scroll (Mantém visibilidade) */
        #main-header.scrolled .logo-img { 
            height: 52px; /* Redução mínima para manter leitura */
        }

        /* MENU */
        .nav-container { display: flex; align-items: center; margin-left: auto; gap: 40px; }
        .nav-links { display: flex; gap: 30px; list-style: none; margin: 0; padding: 0; align-items: center; }
        
        .nav-links li a {
            color: #334155; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 0.9rem; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
            transition: color 0.2s;
        }
        .nav-links li a:hover { color: #00c2cb; }

        /* BOTÃO PESQUISAR */
        .nav-dropdown { position: relative; display: flex; align-items: center; }

        .btn-pesquisa-header {
            background: #00c2cb;
            color: white !important; 
            padding: 10px 24px;
            border-radius: 50px; 
            display: flex; 
            align-items: center; 
            gap: 8px;
            cursor: pointer;
            font-size: 0.85rem; 
            font-weight: 700;
            text-transform: uppercase;
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(0, 194, 203, 0.3);
        }

        .btn-pesquisa-header:hover { 
            background: #009aa3; 
            transform: translateY(-1px); 
            box-shadow: 0 6px 15px rgba(0, 194, 203, 0.4);
        }
        
        /* DROPDOWN */
        .dropdown-menu {
            display: none; 
            position: absolute; 
            top: 130%; right: 0; 
            background: white; 
            min-width: 220px; 
            box-shadow: 0 15px 40px rgba(0,0,0,0.1);
            border-radius: 12px; 
            padding: 10px 0; 
            list-style: none;
            border: 1px solid #f1f5f9;
            z-index: 2100;
            animation: fadeInDrop 0.2s ease forwards;
            opacity: 0; transform: translateY(-10px);
        }
        
        @keyframes fadeInDrop { to { opacity: 1; transform: translateY(0); } }

        .nav-dropdown:hover .dropdown-menu { display: block; }

        .dropdown-menu li a {
            padding: 12px 20px;
            display: flex; align-items: center; gap: 10px;
            color: #475569 !important;
            text-transform: none !important;
            font-size: 0.95rem !important;
            font-weight: 500 !important;
        }
        .dropdown-menu li a:hover { background: #f0fdfe; color: #00c2cb !important; }

        /* MOBILE */
        .mobile-menu-btn { display: none; font-size: 1.8rem; color: #0f172a; background: none; border: none; cursor: pointer; }
        .menu-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1999; }
        .menu-overlay.active { display: block; }

        @media (max-width: 1200px) {
            #main-header { height: 70px; padding: 0 20px; }
            /* Logo Mobile: Tamanho fixo e seguro */
            .logo-img { height: 45px !important; } 
            
            .mobile-menu-btn { display: block; }
            .nav-container { gap: 20px; }
            
            .nav-links {
                position: fixed; top: 0; right: -100%; 
                width: 80%; max-width: 300px; height: 100vh; 
                background: white; flex-direction: column; 
                padding: 80px 0; box-shadow: -5px 0 20px rgba(0,0,0,0.1); 
                transition: 0.3s; z-index: 2100; align-items: stretch;
            }
            .nav-links.active { right: 0; }
            .nav-links li a { padding: 20px 30px; border-bottom: 1px solid #f1f5f9; display: block; }
            
            .nav-dropdown { display: block; width: 100%; padding: 20px 30px; }
            .btn-pesquisa-header { width: 100%; justify-content: center; margin: 0; }
            .dropdown-menu { position: static; box-shadow: none; border: none; display: block; opacity: 1; transform: none; padding-left: 10px; }
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

    const mobileBtn = document.getElementById('mobileBtn');
    const navLinks = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }

    mobileBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // Lógica do Scroll
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
