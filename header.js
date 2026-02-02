document.addEventListener('DOMContentLoaded', function() {
    // Adicionando a fonte Montserrat para um visual mais moderno e limpo
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const headerStyle = `
    <style>
        #main-header {
            background-color: #ffffff;
            height: 100px; /* Aumentado para acomodar fontes maiores */
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 5%;
            position: fixed;
            top: 0; left: 0; width: 100%;
            z-index: 2000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            font-family: 'Montserrat', sans-serif; /* Nova Fonte */
        }

        #main-header.scrolled { height: 80px; }

        .logo-link { display: flex !important; align-items: center; flex-shrink: 0; }
        .logo-img { height: 70px; width: auto; transition: 0.3s; }
        #main-header.scrolled .logo-img { height: 55px; }

        .nav-container { display: flex; align-items: center; margin-left: auto; }

        /* Links Principais Aumentados */
        .nav-links { display: flex; gap: 30px; list-style: none; align-items: center; margin: 0; padding: 0; }
        .nav-links li a {
            color: #003366; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 1rem; /* Aumentado */
            text-transform: uppercase; 
            white-space: nowrap;
            transition: 0.2s;
        }
        .nav-links li a:hover { color: #00c2cb; }

        /* --- CORREÇÃO DEFINITIVA DO PESQUISAR --- */
        .nav-dropdown { position: relative; display: inline-block; }

        .btn-pesquisa-header {
            background: #00c2cb; 
            color: white !important; 
            padding: 12px 25px; 
            border-radius: 50px; 
            display: flex; 
            align-items: center; 
            gap: 10px;
            cursor: pointer;
            font-size: 1rem; /* Aumentado */
            font-weight: 700;
            text-transform: uppercase;
            border: none;
            transition: 0.3s;
        }
        .btn-pesquisa-header:hover { background: #00a9b0; transform: translateY(-2px); }

        .dropdown-menu {
            display: none; 
            position: absolute; 
            top: calc(100% + 10px); /* Garante que apareça abaixo do botão */
            right: 0; 
            background: white; 
            min-width: 220px; 
            box-shadow: 0 10px 30px rgba(0,51,102,0.15);
            border-radius: 15px; 
            padding: 10px 0; 
            list-style: none;
            border: 1px solid #f0f0f0;
            z-index: 2100;
        }

        .dropdown-menu li { width: 100%; border: none !important; }
        .dropdown-menu li a {
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #003366 !important;
            text-transform: none !important;
            font-size: 0.95rem !important;
            font-weight: 600 !important;
        }
        .dropdown-menu li a:hover { background: #f8fbfe; color: #00c2cb !important; }
        
        /* Mostrar dropdown ao passar o mouse */
        .nav-dropdown:hover .dropdown-menu { display: block; }

        .mobile-menu-btn {
            display: none; 
            font-size: 2rem; 
            color: #003366; 
            cursor: pointer; 
            background: none; border: none;
            margin-left: 20px;
        }

        /* --- MOBILE --- */
        @media (max-width: 1150px) {
            .mobile-menu-btn { display: block; }
            .nav-links {
                position: fixed; top: 0; right: -100%; width: 300px; height: 100vh; 
                background: white; flex-direction: column; padding: 100px 30px; 
                box-shadow: -10px 0 30px rgba(0,0,0,0.1); transition: 0.4s ease; 
                gap: 25px; align-items: flex-start;
            }
            .nav-links.active { right: 0; }
            .nav-dropdown { width: 100%; }
            .dropdown-menu { 
                position: static; display: block; box-shadow: none; border: none; 
                padding-left: 20px; background: #f9f9f9; margin-top: 10px;
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
        
        <div class="nav-container">
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html">Início</a></li>
                <li><a href="cadastro.html">Quero Participar</a></li>
                <li><a href="mentores.html">Mentores</a></li>
                <li><a href="desafios.html">Desafios</a></li>
                <li class="nav-dropdown">
                    <div class="btn-pesquisa-header">
                        <i class="fas fa-search"></i> Pesquisar <i class="fas fa-chevron-down" style="font-size: 0.7rem;"></i>
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

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileBtn.querySelector('i').classList.toggle('fa-bars');
        mobileBtn.querySelector('i').classList.toggle('fa-times');
    });

    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
});
