# Lure Digital Dashboard - Frontend

Frontend da aplicação Lure Digital Dashboard, desenvolvido com React, Vite e Tailwind CSS.

## 🚀 Tecnologias

- **React 19** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **tRPC** - Cliente type-safe para API
- **React Query** - Gerenciamento de estado assíncrono
- **Wouter** - Roteamento leve
- **Recharts** - Gráficos e visualizações

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Backend rodando (local ou em produção)
- Conta na Vercel (para deploy)

## 🔧 Configuração Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

#### Para desenvolvimento local (com backend local):

Deixe `VITE_API_URL` vazio para usar o proxy do Vite:

```env
# .env
VITE_API_URL=
VITE_OAUTH_PORTAL_URL=https://oauth.manus.computer
VITE_APP_ID=seu-app-id
```

O Vite irá fazer proxy das requisições `/api/*` para `http://localhost:3000` automaticamente.

#### Para desenvolvimento com backend em produção:

Configure a URL do backend:

```env
# .env
VITE_API_URL=https://seu-backend.onrender.com
VITE_OAUTH_PORTAL_URL=https://oauth.manus.computer
VITE_APP_ID=seu-app-id
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`

Para testar o build localmente:

```bash
npm run preview
```

## 🌐 Deploy na Vercel

### Opção 1: Deploy via CLI

1. Instale a CLI da Vercel:

```bash
npm install -g vercel
```

2. Faça login:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. Para produção:

```bash
vercel --prod
```

### Opção 2: Deploy via Dashboard

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New..."** → **"Project"**
3. Importe seu repositório Git
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Adicione as variáveis de ambiente:
   - `VITE_API_URL` = URL do seu backend no Render (ex: `https://lure-digital-backend.onrender.com`)
   - `VITE_OAUTH_PORTAL_URL` = `https://oauth.manus.computer`
   - `VITE_APP_ID` = Seu App ID do Manus

6. Clique em **"Deploy"**

### Opção 3: Deploy via GitHub (Recomendado)

1. Conecte seu repositório ao Vercel
2. A cada push na branch `main`, a Vercel fará deploy automaticamente
3. Pull requests criarão preview deployments automaticamente

### Configuração CORS no Backend

**IMPORTANTE**: Após o deploy, adicione a URL do frontend na variável `ALLOWED_ORIGINS` do backend:

```env
# No backend (Render)
ALLOWED_ORIGINS=https://seu-app.vercel.app,https://seu-app-preview.vercel.app
```

## 🔗 Estrutura de Rotas

- `/` - Página inicial
- `/dashboard` - Dashboard principal
- `/individual` - Métricas individuais
- `/404` - Página não encontrada

## 📁 Estrutura de Pastas

```
frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes UI (Radix)
│   │   └── ...         # Componentes da aplicação
│   ├── contexts/       # Contextos React
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilitários e configurações
│   ├── pages/          # Páginas da aplicação
│   ├── _core/          # Código core do Manus
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── shared/             # Tipos e constantes compartilhadas com backend
├── vite.config.ts      # Configuração do Vite
├── tsconfig.json       # Configuração do TypeScript
└── package.json        # Dependências e scripts
```

## 🎨 Customização

### Temas

O projeto usa `next-themes` para suporte a dark/light mode. Configure em `src/contexts/ThemeContext.tsx`.

### Componentes UI

Os componentes UI são baseados em Radix UI e estilizados com Tailwind CSS. Customize em `src/components/ui/`.

### Cores e Estilos

Configure as cores do tema em `tailwind.config.js` ou usando variáveis CSS em `src/index.css`.

## 🔒 Autenticação

A autenticação é feita via OAuth do Manus. O fluxo:

1. Usuário clica em "Login"
2. É redirecionado para o portal OAuth
3. Após autenticação, retorna para `/api/oauth/callback` (no backend)
4. Backend define um cookie de sessão
5. Frontend usa o cookie para autenticar requisições tRPC

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Preview do build de produção
- `npm run check` - Verifica tipos TypeScript

## 🐛 Troubleshooting

### Erro de CORS

Se aparecer erro de CORS no console:

1. Verifique se a URL do frontend está em `ALLOWED_ORIGINS` no backend
2. Confirme que `VITE_API_URL` está configurado corretamente
3. Limpe o cache do navegador

### Erro de Conexão com API

1. Verifique se o backend está rodando
2. Confirme a URL em `VITE_API_URL`
3. Verifique os logs do backend
4. Teste o endpoint `/health` do backend

### Build Falha

1. Execute `npm run check` para verificar erros de tipo
2. Limpe o cache: `rm -rf node_modules dist && npm install`
3. Verifique se todas as variáveis de ambiente estão definidas

### Preview Deployments na Vercel

A Vercel cria URLs únicas para cada PR. Adicione o padrão no backend:

```env
ALLOWED_ORIGINS=https://seu-app.vercel.app,https://seu-app-*.vercel.app
```

Ou configure wildcards no código do backend.

## 🚀 Performance

O projeto já está otimizado com:

- Code splitting automático do Vite
- Lazy loading de componentes
- Tree shaking
- Minificação de assets
- Compressão gzip/brotli na Vercel

## 📄 Licença

MIT
