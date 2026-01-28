const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- ÁREA DE DADOS (CONTEXTO DA IA) ---
// Cole aqui dentro os dados reais da UFLA ou empresas.
// Quanto mais detalhes (email, especialidade), melhor a resposta.
const BASE_DE_DADOS = `
CONTEXTO:
Você é o assistente virtual do IPÊ SEARCH, uma plataforma da UFLA (Universidade Federal de Lavras).
Sua função é conectar empresas externas aos pesquisadores e laboratórios da universidade para resolver problemas técnicos.

LISTA DE PESQUISADORES E LABORATÓRIOS DISPONÍVEIS:

1. Dr. Carlos Silva - Departamento de Engenharia (DEG)
   - Especialidade: Automação Industrial, Sensores, Circuitos Elétricos.
   - Laboratório: Lab de Robótica e Automação.
   - Contato: carlos.silva@ufla.br

2. Dra. Ana Souza - Departamento de Ciência da Computação (DCC)
   - Especialidade: Inteligência Artificial, Visão Computacional, Python.
   - Laboratório: Laboratório de IA Aplicada.
   - Contato: ana.souza@ufla.br

3. Dr. Roberto Mendes - Departamento de Física (DFI)
   - Especialidade: Termodinâmica, Transferência de Calor, Usinagem de Precisão.
   - Laboratório: Lab de Materiais Avançados.
   - Contato: roberto.m@ufla.br

4. Núcleo de Engenharia Mecânica
   - Especialidade: Projetos mecânicos, Análise de vibrações, CAD/CAM.
   - Contato: mecanica@ufla.br

(Se você tiver um CSV ou texto grande, pode colar tudo aqui dentro mantendo esse formato)
`;

exports.handler = async function(event, context) {
    // 1. Configuração de Cabeçalhos (Para permitir que seu site acesse a API)
    const headers = {
        'Access-Control-Allow-Origin': '*', // Permite acesso de qualquer lugar (depois pode restringir ao seu site)
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Responde rápido para verificar conexão (Pre-flight request)
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // 2. Verifica se a Chave API existe no Netlify
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            console.error("ERRO: A variável GEMINI_API_KEY não está configurada no Netlify.");
            return { 
                statusCode: 500, 
                headers, 
                body: JSON.stringify({ error: "Erro de configuração no servidor (Chave ausente)." }) 
            };
        }

        // 3. Lê a pergunta que veio do site
        if (!event.body) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Nenhuma mensagem enviada." }) };
        }
        const { message } = JSON.parse(event.body);

        // 4. Configura a IA do Google (Gemini)
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Usamos o modelo 'gemini-1.5-flash' por ser rápido e barato/grátis
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 5. O Prompt (A instrução mestre para a IA)
        const prompt = `
          Aja como um consultor sênior de inovação da UFLA (Ipê Search).
          
          SUA MISSÃO:
          Analisar a dúvida do usuário e indicar qual pesquisador ou laboratório da lista abaixo pode ajudar.

          DADOS DISPONÍVEIS (Use apenas isso como fato):
          ---
          ${BASE_DE_DADOS}
          ---
          
          PERGUNTA DO USUÁRIO: "${message}"
          
          DIRETRIZES DE RESPOSTA:
          1. Se encontrar alguém compatível: Cite o Nome, Departamento e explique COMO a especialidade dele resolve o problema. Forneça o e-mail.
          2. Se a pergunta for genérica (ex: "Oi", "Como funciona"): Explique que você ajuda a encontrar parceiros na UFLA e peça para descreverem o problema técnico.
          3. Se NÃO encontrar ninguém compatível na lista: Peça desculpas, diga que não há especialista cadastrado para isso no momento e sugira contatar a secretaria geral (inovacao@ufla.br).
          4. Tom de voz: Profissional, prestativo e direto.
          5. Idioma: Português do Brasil.
        `;

        // 6. Gera a resposta
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 7. Retorna o texto para o site
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: text })
        };

    } catch (error) {
        console.error("Erro interno:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Ocorreu um erro ao processar sua solicitação." })
        };
    }
};
