// --- CONFIGURAÇÃO ---
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbnwsZ8uZG9R0ienKTzjHlIAu4OIZcf0yIIi4wZSVVLlJrKKpAB0189mgr-oEoCYkp0I-Y18a6zDoV/pub?output=csv";

// Variáveis de memória (Cache)
let cacheDados = null;
let ultimaAtualizacao = 0;

// --- FUNÇÃO 1: LER A PLANILHA ---
async function carregarDadosPlanilha() {
    const agora = Date.now();
    if (cacheDados && (agora - ultimaAtualizacao < 300000)) return cacheDados;

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) return "Erro ao baixar planilha.";
        
        const textoCSV = await response.text();
        const linhas = textoCSV.split('\n');
        if (linhas.length < 2) return "Planilha vazia.";

        // Mapeamento automático
        const cabecalho = linhas[0].toLowerCase().split(',').map(c => c.replace(/"/g, '').trim());
        const idxNome = cabecalho.findIndex(c => c.includes("nome"));
        const idxDepto = cabecalho.findIndex(c => c.includes("departamento") || c.includes("unidade"));
        const idxEmail = cabecalho.findIndex(c => c.includes("e-mail"));
        const idxArea = cabecalho.findIndex(c => c.includes("área") || c.includes("atuação"));
        const idxLinha = cabecalho.findIndex(c => c.includes("linha") || c.includes("pesquisa"));

        if (idxNome === -1) return "Erro: Coluna de Nome não encontrada.";

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
            if (idxLinha > -1) expertise.push(limpar(colunas[idxLinha]));

            lista.push(`- ${nome} (${depto}) | Email: ${email} | Areas: ${expertise.join('. ')}`);
        }
        
        const resultado = lista.join('\n');
        cacheDados = resultado;
        ultimaAtualizacao = agora;
        return resultado;

    } catch (e) {
        return "Erro técnico na planilha.";
    }
}

// --- FUNÇÃO 2: O CÉREBRO (HANDLER) ---
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

        const promptSistema = `
          Você é o 'Ipê Assistant', IA da UFLA.
          DADOS DA PLANILHA:
          ---
          ${dadosUFLA.substring(0, 30000)}
          ---
          PERGUNTA: "${body.message}"
          Responda indicando Nome, Departamento, Email e justificativa.
        `;

        // 🔥 O PULO DO GATO 🔥
        // Usando o nome exato que apareceu na SUA lista de diagnóstico.
        const urlGoogle = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
        
        const respostaGoogle = await fetch(urlGoogle, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptSistema }] }]
            })
        });

        if (!respostaGoogle.ok) {
            const erroDetalhe = await respostaGoogle.text();
            throw new Error(`Google API Erro: ${respostaGoogle.status} - ${erroDetalhe}`);
        }

        const jsonGoogle = await respostaGoogle.json();
        const textoResposta = jsonGoogle.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: textoResposta })
        };

    } catch (error) {
        console.error("Erro:", error);
        return {
            statusCode: 200, 
            headers,
            body: JSON.stringify({ reply: `Desculpe, erro técnico: ${error.message}` })
        };
    }
};
