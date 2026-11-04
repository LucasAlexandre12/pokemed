export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'A variável GEMINI_API_KEY não foi encontrada na Vercel.' });
  }

  const query = String(req.body?.query || '').trim();
  const source = String(req.body?.source || 'Diretrizes Médicas').trim();
  if (!query) return res.status(400).json({ error: 'Digite uma dúvida antes de consultar.' });

  const promptCompleto = `Você é o assistente clínico educacional da plataforma PokeMed, voltada ao estudo para provas de residência médica no Brasil.
Priorize a referência indicada: ${source}.
Estruture a resposta com definição, critérios diagnósticos e sinais de alarme, conduta terapêutica com doses quando houver segurança e pegadinhas de prova.
Não utilize códigos ou formatação TeX/LaTeX para símbolos matemáticos ou de comparação (use caracteres diretos como ≥, ≤).

Dúvida do aluno: ${query}`;

  try {
    // Usando o endpoint oficial v1beta com o modelo gemini-1.5-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptCompleto }]
          }
        ]
      }),
    });

    const data = await response.json();

    // Se a API do Google retornar erro (ex: chave inválida ou cota)
    if (!response.ok) {
      console.error('Erro retornado pelo Google Gemini:', JSON.stringify(data));
      return res.status(502).json({ 
        error: `Erro na API do Google (${response.status}): ${data?.error?.message || 'Falha na resposta'}` 
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'A IA respondeu mas o texto veio vazio. Tente novamente.' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Erro de conexão no servidor:', error);
    return res.status(500).json({ error: 'Erro de conexão com os servidores da IA.' });
  }
}
