# Gerenciador de Tópicos

Aplicação web mobile-friendly para gerenciamento de tópicos com pesquisa no Google e persistência em arquivo .txt.

## Funcionalidades

- ✅ Adicionar tópicos
- ✅ Pesquisar tópicos no Google
- ✅ Remover tópicos
- ✅ Interface responsiva para mobile
- ✅ Persistência em arquivo de texto
- ✅ Design otimizado para dispositivos móveis

## Deploy no Vercel (Gratuito) - CORRIGIDO

### Arquivos Necessários para Upload:
- `package.json` e `package-lock.json`
- `vercel.json` (configuração corrigida)
- `api/topics.js` (função serverless única)
- Pasta `client/` completa (frontend)
- `shared/schema.ts` (validação)
- Arquivos de configuração: `tailwind.config.ts`, `vite.config.ts`, `tsconfig.json`, etc.

### Método 1: Upload Direto (Mais Fácil)

1. **Baixe o projeto:**
   - No Replit: clique nos 3 pontinhos (⋯) → "Download as zip"
   - Extraia o arquivo

2. **Deploy no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Escolha "Upload folder"
   - Selecione a pasta extraída
   - Clique em "Deploy"

### Método 2: Via GitHub

1. **Crie repositório no GitHub**
2. **Upload dos arquivos**
3. **Conecte com Vercel**

### ⚠️ CORREÇÃO APLICADA:
- **Problema:** Erro "tópico não encontrado" ao deletar
- **Solução:** Consolidado todas as operações em uma única função API
- **Sistema de IDs:** Melhorado para persistir corretamente
- **Logs:** Adicionados para debugging no Vercel

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