document.addEventListener('DOMContentLoaded', function() {
    const headerStyle = `
    <style>
        #main-header {
            background-color: #ffffff;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 5%;
            position: fixed;
            top: 0; left: 0; width: 100%; z-index: 2147483645; /* Abaixo apenas do VLibras/IA */
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }

        #main-header.scrolled { height: 70px; }

        .logo-img { max-height: 65px; width: auto; transition: 0.3s; display: block; }
        #main-header.scrolled .logo-img { max-height: 50px; }

        /* Navegação Desktop */
        .nav-container { display: flex; align-items: center; }
        .nav-links { display: flex; gap: 25px; list-style: none; align-items: center; }
        .nav-links li a {
            color: #003366; text-decoration: none; font-weight: 700;
            font-size: 0.85rem; text-transform: uppercase; transition: 0.3s;
        }
        .nav-links li a:hover { color: #00c2cb; }

        /* Botão Pesquisar Desktop */
        .nav-dropdown { position: relative; }
        .btn-pesquisa-header {
            background: #00c2cb; color: white !important; padding: 10px 22px;
            border-radius: 50px; display: flex; align-items: center; gap: 8px;
        }

        .dropdown-menu {
            display: none; position: absolute; top: 100%; right: 0;
            background: white; min-width: 200px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-radius: 8px; padding: 10px 0; list-style: none; border: 1px solid #eee;
        }
        .nav-dropdown:hover .dropdown-menu { display: block; }

        /* MENU MOBILE (HAMBÚRGUER) */
        .mobile-menu-btn {
            display: none; font-size: 1.5rem; color: #003366; cursor: pointer; background: none; border: none;
        }

        @media (max-width: 1024px) {
            .mobile-menu-btn { display: block; }
            .nav-links {
                position: fixed; top: 0; right: -100%; width: 280px; height: 100vh;
                background: white; flex-direction: column; padding: 100px 30px;
                box-shadow: -5px 0 20px rgba(0,0,0,0.1); transition: 0.4s; gap: 30px;
                align-items: flex-start;
            }
            .nav-links.active { right: 0; }
            .nav-dropdown { width: 100%; }
            .dropdown-menu { 
                position: static; display: block; box-shadow: none; 
                border: none; padding-left: 20px; background: #f9f9f9; margin-top: 10px;
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
        
        <button class="mobile-menu-btn" id="mobileBtn">
            <i class="fas fa-bars"></i>
        </button>

        <nav class="nav-container">
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html">Início</a></li>
                <li><a href="cadastro.html">Quero Participar</a></li>
                <li><a href="mentores.html">Mentores</a></li>
                <li><a href="desafios.html">Desafios</a></li>
                <li><a href="index.html#contato">Fale Conosco</a></li>
                <li class="nav-dropdown">
                    <a href="#" class="btn-pesquisa-header">Pesquisar <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="busca.html"><i class="fas fa-search"></i> Pesquisadores</a></li>
                        <li><a href="busca-empresas.html"><i class="fas fa-building"></i> Empresas</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Lógica do Menu Mobile
    const mobileBtn = document.getElementById('mobileBtn');
    const navLinks = document.getElementById('navLinks');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Lógica de Scroll
    window.addEventListener('scroll', function() {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Fechar menu ao clicar em um link (importante para mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
});
