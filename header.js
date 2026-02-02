document.addEventListener('DOMContentLoaded', function() {
    const headerStyle = `
    <style>
        #main-header {
            background-color: #ffffff;
            height: 100px; 
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 5%;
            position: fixed;
            top: 0; left: 0; width: 100%;
            z-index: 2000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            font-family: 'Segoe UI', 'Roboto', Helvetica, Arial, sans-serif;
        }

        #main-header.scrolled { height: 80px; }

        /* LOGO - VISIBILIDADE TOTAL */
        .logo-link { 
            display: flex !important; 
            align-items: center; 
            flex-shrink: 0; 
            min-width: 180px;
            opacity: 1 !important;
            visibility: visible !important;
            text-decoration: none;
        }
        
        .logo-img { 
            height: 70px; 
            width: auto; 
            transition: all 0.3s ease; 
            display: block !important;
        }
        
        #main-header.scrolled .logo-img { height: 55px; }

        /* CONTAINER DO MENU */
        .nav-container { 
            display: flex; 
            align-items: center; 
            margin-left: auto; 
            gap: 40px; 
        }

        .nav-links { 
            display: flex; 
            gap: 30px;
            list-style: none; 
            align-items: center; 
            margin: 0; 
            padding: 0; 
        }

        .nav-links li a {
            color: #003366; 
            text-decoration: none; 
            font-weight: 700;
            font-size: 0.95rem; 
            text-transform: uppercase; 
            white-space: nowrap;
            transition: 0.2s;
        }
        .nav-links li a:hover { color: #00c2cb; }

        /* DROPDOWN PESQUISAR */
        .nav-dropdown { 
            position: relative; 
            display: inline-block; 
            padding-bottom: 20px; 
            margin-bottom: -20px;
        }

        .btn-pesquisa-header {
            background: #00c2cb; 
            color: white !important; 
            padding: 12px 28px; 
            border-radius: 50px; 
            display: flex; 
            align-items: center; 
            gap: 10px;
            cursor: pointer;
            font-size: 0.95rem; 
            font-weight: 800;
            text-transform: uppercase;
            border: none;
            transition: 0.3s;
        }
        .btn-pesquisa-header:hover { background: #00a9b0; transform: translateY(-2px); }

        .dropdown-menu {
            display: none; 
            position: absolute; 
            top: 100%; 
            right: 0; 
            background: white; 
            min-width: 230px; 
            box-shadow: 0 10px 30px rgba(0,51,102,0.15);
            border-radius: 15px; 
            padding: 10px 0; 
            list-style: none;
            border: 1px solid #f0f0f0;
            z-index: 2100;
        }

        .nav-dropdown::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            height: 25px;
            display: none;
        }
        .nav-dropdown:hover::after { display: block; }
        .nav-dropdown:hover .dropdown-menu { display: block; }

        .dropdown-menu li { width: 100%; border: none !important; margin: 0 !important; }
        .dropdown-menu li a {
            padding: 14px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #003366 !important;
            text-transform: none !important;
            font-size: 0.95rem !important;
            font-weight: 600 !important;
        }
        .dropdown-menu li a:hover { background: #f8fbfe; color: #00c2cb !important; }

        /* MOBILE */
        .mobile-menu-btn {
            display: none; 
            font-size: 2rem; 
            color: #003366; 
            cursor: pointer; 
            background: none; 
            border: none; 
            margin-left: 20px;
            z-index: 2200;
        }

        /* OVERLAY ESCURO */
        .menu-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .menu-overlay.active {
            display: block;
            opacity: 1;
        }

        @media (max-width: 1200px) {
            #main-header { 
                height: 70px; 
                padding: 0 20px; 
            }
            
            #main-header.scrolled { height: 70px; }
            
            .logo-img { 
                height: 45px !important; 
            }
            
            .mobile-menu-btn { 
                display: block; 
            }
            
            .nav-links {
                position: fixed; 
                top: 0; 
                right: -100%; 
                width: 85%; 
                max-width: 320px;
                height: 100vh; 
                background: white; 
                flex-direction: column; 
                padding: 80px 0 30px 0;
                box-shadow: -10px 0 30px rgba(0,0,0,0.2); 
                transition: right 0.4s ease; 
                gap: 0;
                align-items: stretch;
                overflow-y: auto;
                z-index: 2100;
            }
            
            .nav-links.active { 
                right: 0; 
            }

            /* Itens do menu mobile */
            .nav-links > li {
                border-bottom: 1px solid #f0f0f0;
                margin: 0 !important;
            }

            .nav-links > li > a {
                padding: 18px 25px;
                display: block;
                font-size: 1rem;
                white-space: normal;
            }

            /* DROPDOWN NO MOBILE */
            .nav-dropdown { 
                width: 100%; 
                padding-bottom: 0; 
                margin-bottom: 0;
            }

            .btn-pesquisa-header {
                width: 100%;
                padding: 18px 25px;
                border-radius: 0;
                justify-content: space-between;
                font-size: 1rem;
            }

            .btn-pesquisa-header .fa-chevron-down {
                transition: transform 0.3s ease;
            }

            .nav-dropdown.open .btn-pesquisa-header .fa-chevron-down {
                transform: rotate(180deg);
            }

            .dropdown-menu { 
                position: static; 
                display: none;
                box-shadow: none; 
                border: none; 
                background: #f8fbfe; 
                width: 100%;
                border-radius: 0;
                padding: 0;
            }

            .nav-dropdown.open .dropdown-menu {
                display: block;
            }

            .dropdown-menu li a {
                padding: 15px 25px 15px 45px !important;
                font-size: 0.9rem !important;
            }

            /* Fechar menu ao clicar nos links */
            .nav-links a:not(.btn-pesquisa-header) {
                position: relative;
            }
        }

        /* Tablets */
        @media (max-width: 768px) {
            .nav-links {
                width: 90%;
                max-width: 280px;
            }
        }

        /* Celulares pequenos */
        @media (max-width: 480px) {
            #main-header {
                padding: 0 15px;
            }
            
            .logo-img {
                height: 40px !important;
            }

            .nav-links {
                width: 100%;
                max-width: 100%;
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
                <li><a href="desafios.html">Desafios</a></li>
                <li><a href="index.html#contato">Fale Conosco</a></li>
                <li class="nav-dropdown" id="navDropdown">
                    <div class="btn-pesquisa-header">
                        <span><i class="fas fa-search"></i> Pesquisar</span>
                        <i class="fas fa-chevron-down" style="font-size: 0.7rem;"></i>
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
    const navDropdown = document.getElementById('navDropdown');
    const dropdownBtn = navDropdown.querySelector('.btn-pesquisa-header');

    // Toggle menu mobile
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        mobileBtn.querySelector('i').classList.toggle('fa-bars');
        mobileBtn.querySelector('i').classList.toggle('fa-times');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar no overlay
    menuOverlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');
        mobileBtn.querySelector('i').classList.add('fa-bars');
        mobileBtn.querySelector('i').classList.remove('fa-times');
        document.body.style.overflow = '';
    });

    // Dropdown toggle no mobile
    dropdownBtn.addEventListener('click', (e) => {
        if (window.innerWidth <= 1200) {
            e.preventDefault();
            navDropdown.classList.toggle('open');
        }
    });

    // Fechar menu ao clicar em links (exceto dropdown)
    navLinks.querySelectorAll('a:not(.btn-pesquisa-header)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1200) {
                navLinks.classList.remove('active');
                menuOverlay.classList.remove('active');
                mobileBtn.querySelector('i').classList.add('fa-bars');
                mobileBtn.querySelector('i').classList.remove('fa-times');
                document.body.style.overflow = '';
            }
        });
    });

    // Scroll header effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1200) {
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
            navDropdown.classList.remove('open');
            mobileBtn.querySelector('i').classList.add('fa-bars');
            mobileBtn.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    });
});
