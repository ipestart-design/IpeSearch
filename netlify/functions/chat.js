// --- CONFIGURAÇÃO ---
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbnwsZ8uZG9R0ienKTzjHlIAu4OIZcf0yIIi4wZSVVLlJrKKpAB0189mgr-oEoCYkp0I-Y18a6zDoV/pub?output=csv";

// Cache Global (Memória de curto prazo do servidor)
let cacheDados = null;
let ultimaAtualizacao = 0;

// --- FUNÇÃO 1: LER E ESTRUTURAR DADOS ---
async function carregarDadosPlanilha() {
    const agora = Date.now();
    // Mantém os dados em cache por 1 hora (3600000ms) para ser rápido
    if (cacheDados && (agora - ultimaAtualizacao < 3600000)) return cacheDados;

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) return "Erro ao baixar dados da UFLA.";
        
        const textoCSV = await response.text();
        const linhas = textoCSV.split('\n');
        if (linhas.length < 2) return "Base de dados vazia.";

        const cabecalho = linhas[0].toLowerCase().split(',').map(c => c.replace(/"/g, '').trim());
        const idxNome = cabecalho.findIndex(c => c.includes("nome"));
        const idxDepto = cabecalho.findIndex(c => c.includes("departamento") || c.includes("unidade"));
        const idxEmail = cabecalho.findIndex(c => c.includes("e-mail"));
        const idxArea = cabecalho.findIndex(c => c.includes("área") || c.includes("atuação"));

        if (idxNome === -1) return "Erro base: Coluna Nome não encontrada.";

        const lista = [];
        for (let i = 1; i < linhas.length; i++) {
            const colunas = linhas[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || linhas[i].split(',');
            if (!colunas || colunas.length <= idxNome) continue;

            const limpar = (t) => t ? t.replace(/^"|"$/g, '').trim() : "";
            const nome = limpar(colunas[idxNome]);
            if (!nome) continue;

            const depto = idxDepto > -1 ? limpar(colunas[idxDepto]) : "UFLA";
            const email = idxEmail > -1 ? limpar(colunas[idxEmail]) : "Não informado";
            
            let expertise = [];
            if (idxArea > -1) expertise.push(limpar(colunas[idxArea]));

            lista.push(`ESPECIALISTA/MENTOR: ${nome} | DEPTO: ${depto} | CONTATO: ${email} | EXPERTISE: ${expertise.join(', ')}`);
        }
        
        const resultado = lista.join('\n');
        cacheDados = resultado;
        ultimaAtualizacao = agora;
        return resultado;

    } catch (e) {
        console.error("Erro planilha:", e);
        return "Erro técnico ao ler base de dados.";
    }
}

// --- FUNÇÃO 2: O CÉREBRO (BACKEND) ---
exports.handler = async function(event, context) {
    // Cabeçalhos para permitir que o site (Frontend) converse com esse código
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    try {
        const API_KEY = process.env.GEMINI_API_KEY; 
        if (!API_KEY) return { statusCode: 200, headers, body: JSON.stringify({ reply: "⚠️ Erro: Chave API (GEMINI_API_KEY) não configurada no Netlify." }) };

        const body = JSON.parse(event.body || '{}');
        const dadosUFLA = await carregarDadosPlanilha();

        // 🔥 PROMPT DE COMPORTAMENTO ESTRATÉGICO 🔥
        const promptSistema = `
          Você é o 'Ipê Assistant', IA do Ecossistema de Inovação da UFLA.
          
          BASE DE CONHECIMENTO (INTERNA):
          ---
          ${dadosUFLA.substring(0, 30000)}
          ---
          
          PERGUNTA DO USUÁRIO: "${body.message}"
          
          REGRAS DE OURO (SIGA ESTRITAMENTE):
          
          1. **APRESENTAÇÃO INICIAL (Gatilho: "Oi", "Olá", "Tudo bem", "Começar"):**
             - Se for a primeira interação, apresente-se de forma SUSCINTA:
             - "Olá! Sou o Ipê Assistant. Conecto você ao ecossistema da UFLA para:
                • Encontrar Pesquisadores e Mentores;
                • Conectar Empresas;
                • Cadastrar Desafios de Inovação.
                Como posso ajudar?"
          
          2. **DIRECIONAMENTO ESTRATÉGICO (Gatilho: Perguntas Genéricas):**
             - Se o usuário perguntar coisas gerais (ex: "Como plantar café?"), responda a dúvida resumidamente, MAS...
             - **OBRIGATORIAMENTE** termine conectando ao objetivo do site.
             - Exemplo: "Para isso você precisa de solo fértil. Aliás, a UFLA tem especialistas nessa área. Quer que eu busque um pesquisador para te auxiliar?"
          
          3. **FUNÇÕES:**
             - Busca de **Pesquisadores/Mentores** (use a base de dados).
             - Cadastro de **Empresas/Dores** (instrua a clicar no botão de cadastro).
          
          4. **TOM DE VOZ:** Profissional, inteligente e focado em gerar conexões.
          5. **FORMATAÇÃO:** Use <b>Nome</b> para destaque e <br> para pular linhas.
        `;

        const configGeracao = {
            temperature: 0.7,
            maxOutputTokens: 1000, // <--- AUMENTADO PARA NÃO CORTAR O TEXTO
        };

        const urlGoogle = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
        
        const respostaGoogle = await fetch(urlGoogle, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptSistema }] }],
                generationConfig: configGeracao
            })
        });

        if (!respostaGoogle.ok) {
            const erroTxt = await respostaGoogle.text();
            throw new Error(`Google API Error: ${erroTxt}`);
        }

        const jsonGoogle = await respostaGoogle.json();
        
        // Verificação de segurança caso a IA não retorne nada
        if (!jsonGoogle.candidates || !jsonGoogle.candidates[0].content) {
            throw new Error("A IA não retornou conteúdo válido.");
        }

        const textoResposta = jsonGoogle.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: textoResposta })
        };

    } catch (error) {
        console.error("Erro no Chat:", error);
        return {
            statusCode: 200, 
            headers,
            body: JSON.stringify({ reply: `Desculpe, tive um lapso momentâneo de memória. Poderia repetir a pergunta?` })
        };
    }
};
