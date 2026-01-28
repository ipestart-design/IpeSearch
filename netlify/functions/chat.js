const { GoogleGenerativeAI } = require("@google/generative-ai");
const professoresData = require("./professores.json");

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

        // Prepara a lista para a IA
        const listaParaIA = professoresData.map(p => 
            `- ${p.nome} (${p.departamento}): Especialista em ${p.especialidade}. Contato: ${p.email}`
        ).join("\n");

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // --- PROMPT ATUALIZADO COM IPESTART ---
        const prompt = `
          Você é o 'Ipê Assistant', IA oficial de inovação da UFLA.
          
          SUA BASE DE DADOS (Use APENAS estes dados):
          ---
          ${listaParaIA}
          ---
          
          PERGUNTA DO USUÁRIO: "${message}"
          
          INSTRUÇÕES OBRIGATÓRIAS:
          1. Busque na lista acima quem melhor resolve o problema técnico do usuário.
          2. Faça associações inteligentes (ex: "gado" -> "Zootecnia", "app" -> "Computação").
          3. Responda indicando: Nome, Departamento e E-mail.
          4. SE NÃO ENCONTRAR NINGUÉM ESPECÍFICO: Diga exatamente: "Não encontrei um especialista exato na minha lista, mas recomendo contatar o IpêTech através do programa IpêStart: ipestart@ufla.br".
          5. Seja cordial, profissional e direto.
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
