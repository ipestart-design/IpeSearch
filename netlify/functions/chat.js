const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. CONFIGURAÇÃO ---
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbnwsZ8uZG9R0ienKTzjHlIAu4OIZcf0yIIi4wZSVVLlJrKKpAB0189mgr-oEoCYkp0I-Y18a6zDoV/pub?output=csv";

let cacheDados = null;
let ultimaAtualizacao = 0;

// --- 2. FUNÇÃO QUE LÊ A PLANILHA (Adaptada para seu Print) ---
async function carregarDadosPlanilha() {
    const agora = Date.now();
    // Cache de 5 minutos
    if (cacheDados && (agora - ultimaAtualizacao < 300000)) {
        return cacheDados;
    }

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Erro ao baixar planilha.");
        
        const textoCSV = await response.text();
        const linhas = textoCSV.split('\n');
        
        if (linhas.length < 2) return "A planilha está vazia.";

        // Identifica as colunas pelo nome exato que vi no seu print
        const cabecalho = linhas[0].toLowerCase().split(',').map(c => c.replace(/"/g, '').trim());
        
        // Mapeamento baseado na imagem enviada
        const idxNome = cabecalho.findIndex(c => c.includes("nome completo"));
        const idxDepto = cabecalho.findIndex(c => c.includes("departamento"));
        const idxEmail = cabecalho.findIndex(c => c.includes("e-mail") || c.includes("email"));
        
        // Colunas de Especialidade (Juntamos tudo para a IA ficar esperta)
        const idxArea = cabecalho.findIndex(c => c.includes("área de atuação"));
        const idxSubarea = cabecalho.findIndex(c => c.includes("subáreas"));
        const idxLinhas = cabecalho.findIndex(c => c.includes("linhas de pesquisa"));
        const idxProjetos = cabecalho.findIndex(c => c.includes("projetos de pesquisa"));

        if (idxNome === -1) return "Erro: Coluna 'NOME COMPLETO' não encontrada.";

        // Monta o texto para a IA
        const listaProfessores = [];

        for (let i = 1; i < linhas.length; i++) {
            // Separa colunas lidando com aspas do CSV
            const colunas = linhas[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || linhas[i].split(',');

            if (!colunas || colunas.length <= idxNome) continue;

            const limpar = (t) => t ? t.replace(/^"|"$/g, '').trim() : "";
            
            const nome = limpar(colunas[idxNome]);
            if (!nome) continue;

            const depto = idxDepto > -1 ? limpar(colunas[idxDepto]) : "UFLA";
            const email = idxEmail > -1 ? limpar(colunas[idxEmail]) : "Não informado";
            
            // Junta todas as competências num texto só
            let competencias = [];
            if (idxArea > -1 && colunas[idxArea]) competencias.push(limpar(colunas[idxArea]));
            if (idxSubarea > -1 && colunas[idxSubarea]) competencias.push(limpar(colunas[idxSubarea]));
            if (idxLinhas > -1 && colunas[idxLinhas]) competencias.push(limpar(colunas[idxLinhas]));
            if (idxProjetos > -1 && colunas[idxProjetos]) competencias.push("Proj: " + limpar(colunas[idxProjetos]));

            const textoCompetencias = competencias.join('. ');

            listaProfessores.push(`- PROF: ${nome} (${depto}) | EMAIL: ${email} | EXPERTISE: ${textoCompetencias}`);
        }

        const dadosFinais = listaProfessores.join('\n');
        
        // Salva no cache
        cacheDados = dadosFinais;
        ultimaAtualizacao = agora;

        return dadosFinais;

    } catch (error) {
        console.error("Erro ao processar planilha:", error);
        return "Erro interno ao ler dados.";
    }
}

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    try {
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) throw new Error("Chave API ausente.");

        if (!event.body) return { statusCode: 400, headers, body: JSON.stringify({ error: "Sem mensagem." }) };
        const { message } = JSON.parse(event.body);

        const dadosUFLA = await carregarDadosPlanilha();

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Você é o 'Ipê Assistant', IA de conexão científica da UFLA.
          
          BASE DE DADOS DE PESQUISADORES (FONTE: PLANILHA OFICIAL):
          ---
          ${dadosUFLA}
          ---
          
          PERGUNTA DO USUÁRIO: "${message}"
          
          INSTRUÇÕES:
          1. Analise a "EXPERTISE" (Área, Subárea, Linhas de Pesquisa) para encontrar o pesquisador ideal.
          2. Responda indicando: Nome, Departamento e E-mail.
          3. Explique brevemente por que esse professor foi escolhido (cite a linha de pesquisa dele).
          4. Se o e-mail estiver na lista, forneça-o.
          5. Caso não encontre ninguém compatível, sugira contato com ipestart@ufla.br.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: response.text() })
        };

    } catch (error) {
        console.error("Erro:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Erro interno." })
        };
    }
};
