# Sendflow - Teste Técnico

Esse é um teste técnico para a empresa **SendFlow**. A aplicação demonstra habilidades em React, Firebase, TypeScript e arquitetura multi-tenant com atualização em tempo real.

## O Projeto

Uma aplicação web onde cada usuário consegue:
- **Criar conexões** (canais de comunicação)
- **Gerenciar contatos** associados a cada conexão
- **Enviar e agendar mensagens** para os contatos
- **Acompanhar tudo em tempo real** sem precisar recarregar a página

A arquitetura é multi-tenant, então cada usuário vê apenas seus próprios dados - totalmente isolado um do outro.

## Stack Tecnológico

### Frontend (`/web`)
- **React 19** para a interface
- **TypeScript** para código seguro
- **Vite** para build
- **Tailwind CSS** para estilos
- **Radix UI + shadcn/ui** para componentes
- **Firebase SDK** para autenticação e banco de dados

### Banco de Dados
- **Cloud Firestore** para armazenar tudo
- **Firebase Auth** para gerenciar usuários

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Um projeto Firebase configurado

### Setup

1. Clone o repositório
```bash
git clone git@github.com:FelipeFreitas96/sendflow.git
cd sendflow
```

2. Instale as dependências do frontend
```bash
cd web
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na pasta `web` com suas credenciais do Firebase:
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

4. Rode o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação abrirá em `http://localhost:5173`

## Estrutura do Projeto

```
sendflow/
├── web/                          # Frontend React
│   ├── src/
│   │   ├── modules/             # Funcionalidades isoladas
│   │   │   ├── auth/            # Autenticação
│   │   │   ├── connections/     # Gerenciar conexões
│   │   │   ├── contacts/        # Gerenciar contatos
│   │   │   └── messages/        # Enviar/agendar mensagens
│   │   ├── pages/               # Páginas da app
│   │   ├── routes/              # Configuração de rotas
│   │   ├── services/            # Integração com Firebase
│   │   ├── components/          # Componentes UI reutilizáveis
│   │   └── lib/                 # Utilitários
│   └── package.json
│
├── firestore.rules              # Regras de segurança do Firestore
└── firebase.json                # Configuração do Firebase
```

## Fluxo da Aplicação

1. **Autenticação**: Usuário faz login/registro pelo Firebase Auth
2. **Dashboard**: Vê suas conexões (canais de comunicação)
3. **Conexões**: Pode criar, editar ou deletar conexões
4. **Contatos**: Para cada conexão, gerencia uma lista de contatos
5. **Mensagens**: Pode enviar mensagens agora ou agendar para depois

Tudo atualiza em tempo real através do Firestore - quando algo muda, a tela atualiza sozinha.

## Design

A interface segue um padrão moderno e limpo:
- **Fundo preto** para um visual premium
- **Amarelo (#FFDE06)** como cor principal de destaque
- **Cinza claro (#F4F4F4)** para texto e elementos
