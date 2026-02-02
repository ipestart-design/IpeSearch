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
        #main-header.scrolled { height: 70px; }
        .logo-img { max-height: 65px; transition: 0.3s; }
        #main-header.scrolled .logo-img { max-height: 50px; }
        
        .nav-links { display: flex; gap: 20px; list-style: none; align-items: center; }
        .nav-links li a {
            color: #003366;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
        }
        
        /* Botão Pesquisar com Dropdown */
        .nav-dropdown { position: relative; }
        .btn-pesquisa-header {
            background: #00c2cb;
            color: white !important;
            padding: 8px 18px;
            border-radius: 50px;
            display: flex; align-items: center; gap: 8px;
        }
        .dropdown-menu {
            display: none; position: absolute; top: 100%; right: 0;
            background: white; min-width: 180px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-radius: 8px; padding: 10px 0; list-style: none;
        }
        .nav-dropdown:hover .dropdown-menu { display: block; }
        .dropdown-menu li a { padding: 10px 20px; display: block; text-transform: none; }
    </style>
    `;

    // 2. Estrutura HTML com as novas abas (Quero Participar, Mentores, Desafios)
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
                <li><a href="desafios.html">Cadastrar Desafio</a></li>
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

    window.addEventListener('scroll', function() {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
});
