const { GoogleGenerativeAI } = require("@google/generative-ai");
//TESTE
// Seu link convertido para CSV
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbnwsZ8uZG9R0ienKTzjHlIAu4OIZcf0yIIi4wZSVVLlJrKKpAB0189mgr-oEoCYkp0I-Y18a6zDoV/pub?output=csv";

async function diagnosticarPlanilha() {
    try {
        // 1. Teste de Conexão
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            return `❌ ERRO DE CONEXÃO: O Google recusou o acesso (Status ${response.status}). Verifique se a planilha está mesmo "Publicada na Web".`;
        }
        
        const textoCSV = await response.text();
        const linhas = textoCSV.split('\n');
        
        if (linhas.length < 2) return `❌ ERRO: A planilha baixou mas parece vazia (tem apenas ${linhas.length} linhas).`;

        // 2. Teste de Colunas (Mostra o que ele enxerga)
        const cabecalhoBruto = linhas[0].trim();
        const cabecalho = cabecalhoBruto.toLowerCase().split(',').map(c => c.replace(/"/g, '').trim());

        // Tenta achar as colunas
        const idxNome = cabecalho.findIndex(c => c.includes("nome"));
        const idxArea = cabecalho.findIndex(c => c.includes("área") || c.includes("area") || c.includes("atuação"));
        const idxLinha = cabecalho.findIndex(c => c.includes("linha") || c.includes("pesquisa"));

        // Se não achar o nome, avisa e mostra o cabeçalho para você conferir
        if (idxNome === -1) {
            return `⚠️ ERRO DE COLUNA: Não achei a coluna 'Nome'.\n\nO robô leu este cabeçalho:\n[${cabecalho.join(' | ')}]\n\nVerifique se o nome está escrito diferente.`;
        }

        // Se chegou aqui, leu pelo menos o nome!
        // Tenta ler a primeira linha de dados para ver se funciona
        const primeiraLinha = linhas[1] || "";
        return `✅ SUCESSO NO TESTE!\nPlanilha lida corretamente.\nColunas encontradas: Nome (Index ${idxNome}), Área (Index ${idxArea}).\nExemplo de dado lido: ${primeiraLinha.substring(0, 50)}...`;

    } catch (error) {
        return `❌ ERRO FATAL: ${error.message}`;
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
        // 1. Verifica Chave API
        if (!process.env.GEMINI_API_KEY) {
            return { statusCode: 200, headers, body: JSON.stringify({ reply: "🔒 ERRO: A chave 'GEMINI_API_KEY' não está configurada no Netlify." }) };
        }

        const body = JSON.parse(event.body || '{}');
        
        // --- MODO DIAGNÓSTICO ---
        // Ele tenta ler a planilha e te conta o resultado
        const resultadoDiagnostico = await diagnosticarPlanilha();

        // Se der erro no diagnóstico, a IA te avisa
        if (resultadoDiagnostico.includes("❌") || resultadoDiagnostico.includes("⚠️")) {
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ reply: `🚨 OPA! Identifiquei o problema:\n\n${resultadoDiagnostico}` }) 
            };
        }

        // Se passou no teste, segue o fluxo normal da IA...
        // (Aqui recarregamos os dados para a IA usar)
        const response = await fetch(SHEET_URL);
        const textoCSV = await response.text();
        const linhas = textoCSV.split('\n');
        
        // Mapeamento simples para o prompt
        const dadosParaIA = linhas.slice(1).map(l => l.replace(/,/g, ' | ')).join('\n').substring(0, 30000); // Limite de caracteres

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Você é o assistente da UFLA.
            DADOS DA PLANILHA:
            ${dadosParaIA}
            
            PERGUNTA DO USUÁRIO: "${body.message}"
            Responda com base nos dados.
        `;

        const result = await model.generateContent(prompt);
        return { statusCode: 200, headers, body: JSON.stringify({ reply: result.response.text() }) };

    } catch (error) {
        return { 
            statusCode: 200, // Retorna 200 para mostrar o erro no chat em vez de "Erro Técnico"
            headers, 
            body: JSON.stringify({ reply: `💥 Ocorreu um erro interno no código: ${error.message}` }) 
        };
    }
};
