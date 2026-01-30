// --- CONFIGURAÇÃO ---
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbnwsZ8uZG9R0ienKTzjHlIAu4OIZcf0yIIi4wZSVVLlJrKKpAB0189mgr-oEoCYkp0I-Y18a6zDoV/pub?output=csv";

// Cache Global
let cacheDados = null;
let ultimaAtualizacao = 0;

// --- FUNÇÃO 1: LER DADOS ---
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

            lista.push(`ESPECIALISTA: ${nome} | DEPTO: ${depto} | CONTATO: ${email} | EXPERTISE: ${expertise.join(', ')}`);
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

        // 🔥 PROMPT CORRIGIDO PARA NÃO REPETIR E NÃO CORTAR 🔥
        const promptSistema = `
          Você é o 'Ipê Assistant', IA de Inovação da UFLA.
          
          BASE DE CONHECIMENTO:
          ---
          ${dadosUFLA.substring(0, 30000)}
          ---
          
          PERGUNTA DO USUÁRIO: "${body.message}"
          
          REGRAS ESTRITAS DE RESPOSTA:
          
          1. **QUANDO SE APRESENTAR:** - APENAS se o usuário disser "Oi", "Olá", "Tudo bem" ou nada mais.
             - Texto padrão: "Olá! Sou o Ipê Assistant. Conecto você a pesquisadores, empresas e mentores da UFLA. Como posso ajudar?"
          
          2. **QUANDO NÃO SE APRESENTAR (IMPORTANTE):**
             - Se o usuário fez uma pergunta específica (ex: "Como faço café?", "Quem pesquisa solos?"), **NÃO** comece com "Olá, sou o Ipê...".
             - Vá **DIRETO** para a resposta da pergunta.
          
          3. **LIGAÇÃO COM A UFLA (Steering):**
             - Responda a dúvida do usuário de forma útil.
             - IMEDIATAMENTE após responder, conecte com a UFLA: "Aliás, para aprofundar nisso, recomendo..."
          
          4. **EVITAR CORTES (Resumo Inteligente):**
             - Ao sugerir pesquisadores, cite **NO MÁXIMO 2 NOMES** mais relevantes para não estourar o limite de texto.
             - Se houver muitos, diga: "E outros especialistas do departamento."
          
          5. **FORMATAÇÃO:**
             - Use <b>Nome do Professor</b>.
             - Use <br> para pular linhas.
        `;

        const configGeracao = {
            temperature: 0.6, // Diminuí um pouco para ela ser mais focada e menos "tagarela"
            maxOutputTokens: 2048, // AUMENTEI O DOBRO para evitar cortar frases
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
        
        if (!jsonGoogle.candidates || !jsonGoogle.candidates[0].content) {
             throw new Error("Sem resposta da IA");
        }

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
            body: JSON.stringify({ reply: `Desculpe, tive uma falha de conexão. Pode repetir?` })
        };
    }
};
