
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY não encontrada na Vercel.'
    });
  }

  const query = String(req.body?.query || '').trim();
  const source = String(req.body?.source || 'Diretrizes Médicas').trim();

  if (!query) {
    return res.status(400).json({
      error: 'Digite uma dúvida antes de consultar.'
    });
  }

  const promptCompleto = `Você é o assistente clínico educacional do PokeMed, voltado ao estudo para provas de residência médica no Brasil.

Priorize a referência indicada: ${source}.
Estruture a resposta com definição, critérios diagnósticos, sinais de alarme e conduta terapêutica.
Inclua doses somente quando houver segurança.
Não utilize formatação TeX ou LaTeX.

Dúvida do aluno: ${query}`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptCompleto }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro Gemini:', response.status, data);

      return res.status(502).json({
        error: `Erro Gemini ${response.status}: ${data?.error?.message || 'Falha desconhecida.'}`
      });
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || '')
      .join('');

    if (!text) {
      return res.status(502).json({
        error: 'O Gemini retornou uma resposta vazia.'
      });
    }

    return res.status(200).json({ text });

  } catch (error) {
    console.error('Erro de conexão:', error);

    return res.status(500).json({
      error: 'Falha de conexão com o Gemini.'
    });
  }
}
