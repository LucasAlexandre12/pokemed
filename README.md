# PokeMed

Plataforma de organização e estudos para Medicina.

## Rodar localmente

1. Instale Node.js (versão 20 ou superior).
2. Na pasta do projeto, execute `npm install`.
3. Execute `npm run dev` e abra o endereço exibido no terminal.

## Publicar na Vercel

Importe este repositório GitHub na Vercel. A Vercel detecta Vite automaticamente.

## Integração PokeMed AI

A IA usa a função de servidor `api/ai.js`. Para ativá-la, configure `GEMINI_API_KEY` nas variáveis de ambiente do projeto na Vercel. Não use uma variável `VITE_` para chaves secretas.

## Armazenamento

Nesta versão, o progresso fica salvo no armazenamento local do navegador. Ainda não há login nem sincronização entre dispositivos.
