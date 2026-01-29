exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    try {
        const API_KEY = process.env.GEMINI_API_KEY; 
        
        // Vamos perguntar pro Google quais modelos estão disponíveis
        // Usamos a versão v1beta que é a mais abrangente
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ reply: `❌ ERRO NA CONTA: ${data.error.message}` })
            };
        }

        // Filtra só os modelos que servem para gerar texto (generateContent)
        const modelosDisponiveis = data.models
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name) // Pega o nome técnico (ex: models/gemini-pro)
            .join('\n');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                reply: `🕵️‍♂️ LISTA DE MODELOS DISPONÍVEIS:\n\n${modelosDisponiveis}\n\n(Copie essa lista e mande pro dev!)` 
            })
        };

    } catch (error) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: `💥 Erro fatal: ${error.message}` })
        };
    }
};
