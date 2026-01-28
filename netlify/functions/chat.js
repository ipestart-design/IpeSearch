const { GoogleGenerativeAI } = require("@google/generative-ai");

// AQUI É O PULO DO GATO:
// O comando 'require' vai buscar as 50 mil linhas no outro arquivo automaticamente.
// Não precisa colar nada aqui!
const dadosBrutos = require("./professores.json"); 

// --- FUNÇÃO PARA PROCESSAR OS DADOS ---
function processarDadosGigantes(dados) {
    const mapaProfessores = new Map();

    dados.forEach(registro => {
        const nome = registro.nome_professor ? registro.nome_professor.trim().toUpperCase() : null;
        if (!nome) return; 

        if (!mapaProfessores.has(nome)) {
            mapaProfessores.set(nome, {
                nome: registro.nome_professor.trim(),
                depto: registro.unidade ? registro.unidade.trim() : "UFLA",
                disciplinas: new Set()
            });
        }

        if (registro.nome_disciplina) {
            mapaProfessores.get(nome).disciplinas.add(registro.nome_disciplina.trim());
        }
    });

    return Array.from(mapaProfessores.values()).map(p => {
        const areas = Array.from(p.disciplinas).slice(0, 15).join(', ');
        return `- ${p.nome} (${p.depto}) | Aulas: ${areas}`;
    }).join('\n');
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

        // Processa o arquivo gigante
        const contextoLimpo = processarDadosGigantes(dadosBrutos);

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Você é o 'Ipê Assistant', IA de inovação da UFLA.
          
          BASE DE DADOS COMPLETA UFLA:
          ---
          ${contextoLimpo}
          ---
          
          PERGUNTA DO USUÁRIO: "${message}"
          
          INSTRUÇÕES:
          1. Encontre o professor mais adequado baseando-se nas Aulas/Disciplinas.
          2. Indique Nome e Departamento.
          3. O banco não tem e-mails. Mande buscar no SIGAA.
          4. Se não achar, indique o IpêStart (ipestart@ufla.br).
          5. Responda em Português.
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
            body: JSON.stringify({ error: "Erro interno. Verifique o arquivo professores.json." })
        };
    }
};
