document.addEventListener('DOMContentLoaded', function() {
    // 1. Definição do CSS específico do Header (isolado)
    const headerStyle = `
    <style>
        #main-header {
            background-color: #ffffff;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 4%;
            position: fixed;
            top: 0; left: 0; width: 100%; z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }

        /* Estado ao rolar a página */
        #main-header.scrolled { 
            height: 70px; 
            background-color: rgba(255, 255, 255, 0.98);
        }

        .logo-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            transition: transform 0.3s ease;
        }

        .logo-img { 
            max-height: 65px; 
            width: auto;
            transition: all 0.3s ease; 
            display: block;
        }

        /* Logo diminui mas continua visível */
        #main-header.scrolled .logo-img { 
            max-height: 50px; 
        }
        
        .nav-links { display: flex; gap: 20px; list-style: none; align-items: center; margin: 0; padding: 0; }
        .nav-links li a {
            color: #003366;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
            transition: color 0.3s;
        }
        .nav-links li a:hover { color: #00c2cb; }
        
        /* Botão Pesquisar com Dropdown */
        .nav-dropdown { position: relative; }
        .btn-pesquisa-header {
            background: #00c2cb;
            color: white !important;
            padding: 10px 22px;
            border-radius: 50px;
            display: flex; align-items: center; gap: 8px;
            transition: background 0.3s, transform 0.2s;
        }
        .btn-pesquisa-header:hover { background: #00a9b0; transform: translateY(-1px); }

        .dropdown-menu {
            display: none; position: absolute; top: 100%; right: 0;
            background: white; min-width: 200px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            border-radius: 8px; padding: 10px 0; list-style: none;
            margin-top: 10px;
            border: 1px solid #f0f0f0;
        }
        .nav-dropdown:hover .dropdown-menu { display: block; }
        .dropdown-menu li a { 
            padding: 12px 20px; 
            display: flex; 
            align-items: center; 
            gap: 10px;
            text-transform: none; 
            color: #003366;
            font-size: 0.9rem;
        }
        .dropdown-menu li a:hover { background-color: #f8fbfe; color: #00c2cb; }
    </style>
    `;

    // 2. Estrutura HTML
    const headerHTML = `
    ${headerStyle}
    <header id="main-header">
        <a href="index.html" class="logo-link">
            <img src="logo.png" alt="IPÊ CONECT" class="logo-img">
        </a>
        <nav>
            <ul class="nav-links">
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

    // 3. Injeção e Comportamento
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Observer de scroll para mudar a altura do header
    window.addEventListener('scroll', function() {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
