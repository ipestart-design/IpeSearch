const { GoogleGenerativeAI } = require("@google/generative-ai");
const dadosBrutos = require("./professores.json");

// --- FUNÇÃO PARA ORGANIZAR OS DADOS DO SIGRH ---
function processarDadosProfessores(dados) {
    const mapaProfessores = new Map();

    dados.forEach(registro => {
        const nome = registro.nome_professor;
        
        // Se o professor ainda não está na lista, cria o perfil dele
        if (!mapaProfessores.has(nome)) {
            mapaProfessores.set(nome, {
                nome: nome,
                departamento: registro.unidade ? registro.unidade.trim() : "UFLA",
                disciplinas: new Set(), // Usa Set para não repetir disciplinas
                cursos: new Set()
            });
        }

        // Adiciona as disciplinas e cursos que ele leciona (isso vira a "Especialidade")
        const prof = mapaProfessores.get(nome);
        if (registro.nome_disciplina) prof.disciplinas.add(registro.nome_disciplina);
        if (registro.cursos) prof.cursos.add(registro.cursos);
    });

    // Transforma em texto para a IA ler
    return Array.from(mapaProfessores.values()).map(p => {
        const areas = Array.from(p.disciplinas).slice(0, 8).join(', '); // Pega até 8 disciplinas para não ficar gigante
        const cursos = Array.from(p.cursos).slice(0, 3).join(', ');
        return `- NOME: ${p.nome}\n  DEPTO: ${p.departamento}\n  ÁREAS DE ATUAÇÃO (Baseado nas disciplinas): ${areas}\n  CURSOS: ${cursos}`;
    }).join('\n\n');
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

        // 1. Processa a lista gigante para um formato limpo
        const baseDeConhecimento = processarDadosProfessores(dadosBrutos);

        const genAI = new GoogleGenerativeAI(API_KEY);
        // Usamos o Flash pois ele aguenta textos muito longos (até 1 milhão de tokens)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 2. Prompt Otimizado
        const prompt = `
          Você é o 'Ipê Assistant', IA de inovação da UFLA.
          
          SUA BASE DE DADOS (LISTA REAL DE PROFESSORES):
          ---
          ${baseDeConhecimento}
          ---
          
          PERGUNTA DO USUÁRIO: "${message}"
          
          INSTRUÇÕES:
          1. Busque na lista acima o professor cujas disciplinas/áreas mais se relacionam com a dúvida do usuário.
          2. IMPORTANTE: O arquivo original NÃO tem e-mails. Se encontrar um professor, diga o Nome e o Departamento, e instrua o usuário a buscar o contato no site oficial da UFLA ou no SIGAA.
          3. SE NÃO ENCONTRAR NINGUÉM ESPECÍFICO: Diga exatamente: "Não encontrei um especialista exato na minha lista, mas recomendo contatar o IpêTech através do programa IpêStart: ipestart@ufla.br".
          4. Seja cordial e direto. Responda em Português.
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
            body: JSON.stringify({ error: "Erro interno no servidor." })
        };
    }
};
