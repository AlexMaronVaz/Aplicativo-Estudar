# Arquivos Necessários para Deploy no Vercel

## Arquivos OBRIGATÓRIOS para o Vercel:

### Configuração Principal:
- `package.json` (dependências)
- `vercel.json` (configuração do Vercel)
- `README.md` (instruções)

### Frontend (pasta client/):
- `client/index.html`
- `client/src/main.tsx`
- `client/src/App.tsx` 
- `client/src/index.css`
- `client/src/pages/home.tsx`
- `client/src/pages/not-found.tsx`
- `client/src/components/` (toda a pasta)
- `client/src/hooks/` (toda a pasta)
- `client/src/lib/` (toda a pasta)

### API Serverless (pasta api/):
- `api/topics.js`
- `api/topics/[id].js`

### Schemas Compartilhados:
- `shared/schema.ts`

### Configuração:
- `tailwind.config.ts`
- `tsconfig.json`
- `vite.config.ts`
- `postcss.config.js`
- `components.json`

## Como fazer o upload no Vercel:

1. Baixe todos esses arquivos mantendo a estrutura de pastas
2. No Vercel, clique em "New Project"
3. Escolha "Upload folder" 
4. Selecione a pasta com todos os arquivos
5. Clique "Deploy"

## Alternativa mais simples:
- Use o botão "Download as zip" do Replit
- Extraia o zip
- Faça upload da pasta inteira no Vercel