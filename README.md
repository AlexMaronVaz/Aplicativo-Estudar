# Gerenciador de Tópicos

Aplicação web mobile-friendly para gerenciamento de tópicos com pesquisa no Google e persistência em arquivo .txt.

## Funcionalidades

- ✅ Adicionar tópicos
- ✅ Pesquisar tópicos no Google
- ✅ Remover tópicos
- ✅ Interface responsiva para mobile
- ✅ Persistência em arquivo de texto
- ✅ Design otimizado para dispositivos móveis

## Deploy no Vercel (Gratuito)

### Método 1: Deploy direto pelo Git

1. **Conecte seu projeto ao GitHub:**
   - Vá para [GitHub](https://github.com)
   - Crie um novo repositório
   - Faça upload dos arquivos do projeto

2. **Deploy no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte sua conta GitHub
   - Selecione o repositório do projeto
   - Clique em "Deploy"

### Método 2: Deploy via CLI

1. **Instale o Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

## Estrutura do Projeto

```
├── api/                 # Funções serverless para Vercel
│   ├── topics.js       # API principal de tópicos
│   └── topics/[id].js  # API para deletar por ID
├── client/             # Frontend React
├── server/             # Backend Express (desenvolvimento)
├── shared/             # Schemas compartilhados
└── vercel.json         # Configuração do Vercel
```

## Desenvolvimento Local

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## Tecnologias

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express
- **Deploy:** Vercel (serverless)
- **Persistência:** Arquivo de texto (.txt)