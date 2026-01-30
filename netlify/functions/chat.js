// --- CONFIGURAÇÃO ---
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbnwsZ8uZG9R0ienKTzjHlIAu4OIZcf0yIIi4wZSVVLlJrKKpAB0189mgr-oEoCYkp0I-Y18a6zDoV/pub?output=csv";

// Cache Global
let cacheDados = null;
let ultimaAtualizacao = 0;

// --- FUNÇÃO 1: LER E ESTRUTURAR DADOS ---
async function carregarDadosPlanilha() {
    const agora = Date.now();
    if (cacheDados && (agora - ultimaAtualizacao < 3600000)) return cacheDados;

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) return "Erro ao baixar dados.";
        
        const textoCSV = await response.text();
        const linhas = textoCSV.split('\n');
        if (linhas.length < 2) return "Base vazia.";

        const cabecalho = linhas[0].toLowerCase().split(',').map(c => c.replace(/"/g, '').trim());
        const idxNome = cabecalho.findIndex(c => c.includes("nome"));
        const idxDepto = cabecalho.findIndex(c => c.includes("departamento") || c.includes("unidade"));
        const idxEmail = cabecalho.findIndex(c => c.includes("e-mail"));
        const idxArea = cabecalho.findIndex(c => c.includes("área") || c.includes("atuação"));

        if (idxNome === -1) return "Erro base.";

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
        return "Erro técnico.";
    }
}

// --- FUNÇÃO 2: O CÉREBRO ---
exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    try {
        const API_KEY = process.env.GEMINI_API_KEY; 
        if (!API_KEY) return { statusCode: 200, headers, body: JSON.stringify({ reply: "⚠️ Erro: Chave API ausente." }) };

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
             - Se for a primeira interação ou saudação, apresente-se de forma SUSCINTA e liste seus objetivos:
             - "Olá! Sou o Ipê Assistant. Conecto você ao ecossistema da UFLA para:
                • Encontrar Pesquisadores e Mentores;
                • Conectar Empresas;
                • Cadastrar Desafios de Inovação.
                Como posso ajudar?"
          
          2. **DIRECIONAMENTO ESTRATÉGICO (Gatilho: Perguntas Genéricas):**
             - Se o usuário fizer perguntas do dia a dia (ex: "O que é IA?", "Como plantar café?", "Previsão do tempo"), responda a dúvida de forma prestativa e resumida, MAS...
             - **OBRIGATORIAMENTE** termine a resposta conectando ao objetivo do site.
             - Exemplo: "Para plantar café você precisa de solo X e Y. Aliás, a UFLA tem os maiores especialistas em cafeicultura do mundo. Quer que eu busque um pesquisador dessa área para te auxiliar?"
          
          3. **FUNÇÕES DO SITE:**
             - Busca de **Pesquisadores/Mentores** (use a base de dados).
             - Cadastro de **Empresas/Dores** (instrua a clicar no botão de cadastro).
          
          4. **TOM DE VOZ:** Profissional, inteligente e focado em gerar conexões.
          5. **FORMATAÇÃO:** Use <b>Nome</b> para destaque e listas simples.
        `;

        const configGeracao = {
            temperature: 0.7,
            maxOutputTokens: 600,
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

        if (!respostaGoogle.ok) throw new Error("Google API Error");

        const jsonGoogle = await respostaGoogle.json();
        const textoResposta = jsonGoogle.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: textoResposta })
        };

    } catch (error) {
        return {
            statusCode: 200, 
            headers,
            body: JSON.stringify({ reply: `Momentaneamente indisponível. Tente recarregar.` })
        };
    }
};
