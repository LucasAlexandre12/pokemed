export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'A integração de IA ainda não foi configurada no servidor.' });
  }

  const query = String(req.body?.query || '').trim();
  const source = String(req.body?.source || 'Diretrizes Médicas').trim();
  if (!query) return res.status(400).json({ error: 'Digite uma dúvida antes de consultar.' });

  const systemPrompt = `Você é o assistente clínico educacional da plataforma PokeMed, voltada ao estudo para provas de residência médica no Brasil. Priorize a referência indicada pelo usuário: ${source}. Estruture a resposta com definição, critérios diagnósticos e sinais de alarme, conduta terapêutica com doses quando houver segurança e pegadinhas de prova. Diferencie recomendações de diretrizes e não invente referências. Quando não tiver certeza, deixe isso explícito. A resposta é material educacional e não substitui avaliação médica.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: query }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!response.ok || !text) {
      return res.status(502).json({ error: 'A IA não conseguiu responder agora. Tente novamente.' });
    }
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Erro na integração Gemini:', error);
    return res.status(500).json({ error: 'Erro ao conectar com a IA.' });
  }
}
