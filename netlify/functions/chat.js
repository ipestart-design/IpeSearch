// --- CONFIGURAÇÃO ---
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbnwsZ8uZG9R0ienKTzjHlIAu4OIZcf0yIIi4wZSVVLlJrKKpAB0189mgr-oEoCYkp0I-Y18a6zDoV/pub?output=csv";

// Cache Global
let cacheDados = null;
let ultimaAtualizacao = 0;

// Importar fetch (compatível com Netlify)
const fetch = require('node-fetch');

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
        console.error('Erro ao carregar planilha:', e);
        return "Erro técnico.";
    }
}

// --- FUNÇÃO 2: O CÉREBRO (COM MEMÓRIA) ---
exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const API_KEY = process.env.GEMINI_API_KEY; 
        if (!API_KEY) {
            console.error('API_KEY não encontrada');
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ reply: "⚠️ Erro: Chave API ausente." }) 
            };
        }

        const body = JSON.parse(event.body || '{}');
        const mensagemAtual = body.message || '';
        const historicoConversa = body.history || [];
        
        const dadosUFLA = await carregarDadosPlanilha();

        // 🔥 CONSTRUIR CONTEXTO COM HISTÓRICO 🔥
        let contextoCompleto = `
Você é o 'Ipê Assistant', IA de Inovação da UFLA.

BASE DE CONHECIMENTO:
---
${dadosUFLA.substring(0, 25000)}
---

HISTÓRICO DA CONVERSA:
${historicoConversa.slice(-8).map(msg => `${msg.role === 'user' ? 'USUÁRIO' : 'VOCÊ'}: ${msg.content}`).join('\n')}

MENSAGEM ATUAL DO USUÁRIO: "${mensagemAtual}"

REGRAS ESTRITAS DE RESPOSTA:

1. **CONTINUIDADE:** Se o usuário fez uma pergunta anterior relacionada, CONTINUE a conversa naturalmente. NÃO se apresente novamente.

2. **QUANDO SE APRESENTAR:** - APENAS se for a PRIMEIRA mensagem ("Oi", "Olá", "Tudo bem").
   - Texto padrão: "Olá! Sou o Ipê Assistant. Conecto você a pesquisadores, empresas e mentores da UFLA. Como posso ajudar?"

3. **QUANDO NÃO SE APRESENTAR:**
   - Se o usuário já fez perguntas antes ou está continuando uma conversa, vá DIRETO para a resposta.
   - NÃO repita "Olá, sou o Ipê Assistant" em cada mensagem.

4. **LIGAÇÃO COM A UFLA (Steering):**
   - Responda a dúvida do usuário de forma útil.
   - Quando relevante, conecte com a UFLA: "Para aprofundar nisso, recomendo..."

5. **EVITAR CORTES (Resumo Inteligente):**
   - Ao sugerir pesquisadores, cite **NO MÁXIMO 2 NOMES** mais relevantes.
   - Se houver muitos, diga: "E outros especialistas do departamento."

6. **FORMATAÇÃO:**
   - Use <b>Nome do Professor</b> para destacar.
   - Use <br> para pular linhas.

7. **MEMÓRIA:** Use o histórico acima para dar respostas contextualizadas.
`;

        const configGeracao = {
            temperature: 0.7,
            maxOutputTokens: 2048,
        };

        const urlGoogle = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const respostaGoogle = await fetch(urlGoogle, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: contextoCompleto }] }],
                generationConfig: configGeracao
            })
        });

        if (!respostaGoogle.ok) {
            const errorText = await respostaGoogle.text();
            console.error('Erro Google API:', respostaGoogle.status, errorText);
            throw new Error(`Google API Error: ${respostaGoogle.status}`);
        }

        const jsonGoogle = await respostaGoogle.json();
        
        if (!jsonGoogle.candidates || !jsonGoogle.candidates[0]?.content) {
            console.error('Resposta inválida da API:', JSON.stringify(jsonGoogle));
            throw new Error("Sem resposta da IA");
        }

        const textoResposta = jsonGoogle.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: textoResposta })
        };

    } catch (error) {
        console.error('Erro completo:', error);
        return {
            statusCode: 200, 
            headers,
            body: JSON.stringify({ 
                reply: `⚠️ Desculpe, tive uma falha de conexão. Tente novamente em instantes.` 
            })
        };
    }
};
