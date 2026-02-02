document.addEventListener('DOMContentLoaded', function() {
    const headerStyle = `
    <style>
        #main-header {
            background-color: #ffffff;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: space-between; /* Garante logo na ponta esquerda e menu na direita */
            padding: 0 5%;
            position: fixed;
            top: 0; left: 0; width: 100%;
            z-index: 2000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }

        #main-header.scrolled { height: 70px; }

        /* Ajuste da Logo - Forçando visibilidade total */
        .logo-link { 
            display: flex !important; 
            align-items: center; 
            min-width: 150px; /* Impede que a logo suma em telas grandes */
            opacity: 1 !important; 
            visibility: visible !important;
        }
        
        .logo-img { 
            height: 60px; 
            width: auto; 
            transition: 0.3s; 
        }
        
        #main-header.scrolled .logo-img { height: 45px; }

        /* Menu Desktop */
        .nav-links { 
            display: flex; 
            gap: 25px; 
            list-style: none; 
            align-items: center; 
            margin: 0; 
        }

        .nav-links li a {
            color: #003366; 
            text-decoration: none; 
            font-weight: 700;
            font-size: 0.85rem; 
            text-transform: uppercase; 
            transition: 0.3s;
        }
        .nav-links li a:hover { color: #00c2cb; }

        /* Botão Pesquisar Premium */
        .btn-pesquisa-header {
            background: #00c2cb; 
            color: white !important; 
            padding: 10px 22px; 
            border-radius: 50px; 
            display: flex; 
            align-items: center; 
            gap: 8px;
            box-shadow: 0 4px 10px rgba(0, 194, 203, 0.2);
        }

        /* Menu Mobile - Botão Hambúrguer */
        .mobile-menu-btn {
            display: none; 
            font-size: 1.8rem; 
            color: #003366; 
            cursor: pointer; 
            background: none; 
            border: none;
            padding: 5px;
            line-height: 1;
        }

        /* --- RESPONSIVIDADE --- */
        @media (max-width: 1024px) {
            .nav-links {
                position: fixed; 
                top: 0; 
                right: -100%; 
                width: 280px; 
                height: 100vh; 
                background: white; 
                flex-direction: column; 
                padding: 100px 30px; 
                box-shadow: -5px 0 25px rgba(0,0,0,0.15);
                transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
                gap: 25px; 
                align-items: flex-start;
            }

            .nav-links.active { right: 0; }
            .mobile-menu-btn { display: block; } /* Aparece apenas no mobile */
            
            .nav-links li { width: 100%; }
            .nav-links li a { font-size: 1.1rem; display: block; width: 100%; }
            
            /* Dropdown adaptado para mobile */
            .nav-dropdown .dropdown-menu { 
                position: static; 
                display: block; 
                background: #f8f9fa; 
                box-shadow: none;
                margin-top: 10px;
                padding-left: 15px;
            }
        }
    </style>
    `;

    const headerHTML = `
    ${headerStyle}
    <header id="main-header">
        <a href="index.html" class="logo-link">
            <img src="logo.png" alt="IPÊ CONECT" class="logo-img">
        </a>
        
        <nav>
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html">Início</a></li>
                <li><a href="cadastro.html">Quero Participar</a></li>
                <li><a href="mentores.html">Mentores</a></li>
                <li><a href="desafios.html">Desafios</a></li>
                <li class="nav-dropdown">
                    <a href="#" class="btn-pesquisa-header">Pesquisar <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="busca.html">Pesquisadores</a></li>
                        <li><a href="busca-empresas.html">Empresas</a></li>
                    </ul>
                </li>
            </ul>
        </nav>

        <button class="mobile-menu-btn" id="mobileBtn">
            <i class="fas fa-bars"></i>
        </button>
    </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    const mobileBtn = document.getElementById('mobileBtn');
    const navLinks = document.getElementById('navLinks');

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Fecha o menu ao clicar em qualquer lugar fora dele
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileBtn.querySelector('i').classList.add('fa-bars');
            mobileBtn.querySelector('i').classList.remove('fa-times');
        }
    });

    window.addEventListener('scroll', function() {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
});
