const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- CONFIGURAÇÃO ---
// Seu link oficial do Google Sheets (formato CSV para a IA ler)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbnwsZ8uZG9R0ienKTzjHlIAu4OIZcf0yIIi4wZSVVLlJrKKpAB0189mgr-oEoCYkp0I-Y18a6zDoV/pub?output=csv"; 

let cacheDados = null;
let ultimaAtualizacao = 0;

// --- FUNÇÃO PARA BUSCAR E LER A PLANILHA ---
async function buscarDadosPlanilha() {
    // Cache de 5 minutos (300.000 ms) para não sobrecarregar o Google
    const agora = Date.now();
    if (cacheDados && (agora - ultimaAtualizacao < 300000)) {
        return cacheDados;
    }

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Erro ao baixar planilha");
        const textoCSV = await response.text();
        
        const linhas = textoCSV.split('\n');
        if (linhas.length < 2) return ""; 

        // Descobre a posição das colunas
        const cabecalho = linhas[0].split(',').map(c => c.replace(/"/g, '').trim().toLowerCase());
        
        // Mapeia as colunas baseadas nos nomes que vimos no seu arquivo
        const idxNome = cabecalho.findIndex(c => c.includes("nome") || c.includes("professor"));
        const idxDepto = cabecalho.findIndex(c => c.includes("unidade") || c.includes("departamento") || c.includes("depto"));
        const idxMateria = cabecalho.findIndex(c => c.includes("disciplina") || c.includes("matéria") || c.includes("aula"));

        if (idxNome === -1) return "Erro: Coluna de Nome não encontrada.";

        const mapa = new Map();

        // Processa as linhas
        for (let i = 1; i < linhas.length; i++) {
            // Regex para separar CSV corretamente mesmo com vírgulas dentro do texto
            const colunas = linhas[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || linhas[i].split(',');

            if (!colunas || colunas.length <= idxNome) continue;

            const limpar = (txt) => txt ? txt.replace(/^"|"$/g, '').trim() : "";
            const nome = limpar(colunas[idxNome]);
            const depto = idxDepto > -1 ? limpar(colunas[idxDepto]) : "UFLA";
            const materia = idxMateria > -1 ? limpar(colunas[idxMateria]) : "";

            if (!nome) continue;

            // Agrupa as aulas do mesmo professor
            if (!mapa.has(nome)) {
                mapa.set(nome, { nome, depto, aulas: new Set() });
            }
            if (materia) mapa.get(nome).aulas.add(materia);
        }

        // Transforma em texto para a IA
        const textoFinal = Array.from(mapa.values()).map(p => {
            const listaAulas = Array.from(p.aulas).slice(0, 15).join(', ');
            return `- PROF: ${p.nome} (${p.depto}) | AULAS: ${listaAulas}`;
        }).join('\n');

        cacheDados = textoFinal;
        ultimaAtualizacao = agora;
        
        return textoFinal;

    } catch (error) {
        console.error("Erro ao ler planilha:", error);
        return "Erro ao carregar dados da UFLA.";
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

        // Busca dados (da memória ou da planilha)
        const baseDeConhecimento = await buscarDadosPlanilha();

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Você é o 'Ipê Assistant', IA oficial de inovação da UFLA.
          
          DADOS EM TEMPO REAL (Google Sheets):
          ---
          ${baseDeConhecimento}
          ---
          
          PERGUNTA DO USUÁRIO: "${message}"
          
          INSTRUÇÕES:
          1. Encontre o professor mais adequado para resolver a dúvida.
          2. Indique Nome, Departamento e suas principais disciplinas.
          3. IMPORTANTE: Não invente e-mails. Instrua o usuário a buscar o contato no SIGAA ou site da UFLA.
          4. Se não encontrar ninguém na lista, recomende o contato com o IpêTech: ipestart@ufla.br.
          5. Seja cordial e direto.
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
