# Lure Digital Dashboard - Backend

Backend da aplicação Lure Digital Dashboard, desenvolvido com Express.js, tRPC e integração com Google Sheets.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express.js** - Framework web
- **tRPC** - API type-safe
- **Drizzle ORM** - ORM para MySQL
- **MySQL** - Banco de dados
- **OAuth** - Autenticação via Manus
- **AWS S3** - Armazenamento de arquivos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Banco de dados MySQL configurado
- Conta no Render (para deploy)

## 🔧 Configuração Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=mysql://user:password@localhost:3306/lure_digital
VITE_OAUTH_PORTAL_URL=https://oauth.manus.computer
VITE_APP_ID=seu-app-id
OAUTH_CLIENT_SECRET=seu-client-secret
```

### 3. Executar migrações do banco de dados

```bash
npm run db:push
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🌐 Deploy no Render

### Opção 1: Deploy via Dashboard

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório Git
4. Configure:
   - **Name**: `lure-digital-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Escolha o plano adequado

5. Adicione as variáveis de ambiente na seção **"Environment"**:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `ALLOWED_ORIGINS=https://seu-frontend.vercel.app`
   - `DATABASE_URL=sua-url-do-banco`
   - `VITE_OAUTH_PORTAL_URL=https://oauth.manus.computer`
   - `VITE_APP_ID=seu-app-id`
   - `OAUTH_CLIENT_SECRET=seu-client-secret`
   - Adicione as variáveis AWS se estiver usando S3

6. Clique em **"Create Web Service"**

### Opção 2: Deploy via render.yaml

O arquivo `render.yaml` já está configurado. Basta:

1. Fazer push do código para o repositório
2. Conectar o repositório no Render
3. O Render detectará automaticamente o `render.yaml`
4. Configure as variáveis de ambiente marcadas como `sync: false`

### Configuração do Banco de Dados

No Render, você pode:

1. Criar um banco MySQL no próprio Render
2. Usar um serviço externo como PlanetScale, Railway, etc.
3. Copiar a `DATABASE_URL` e adicionar nas variáveis de ambiente

### Health Check

O backend possui um endpoint de health check em `/health` que retorna:

```json
{
  "status": "ok",
  "timestamp": "2026-02-10T00:00:00.000Z"
}
```

## 🔗 Endpoints Principais

### API REST

- `GET /api/dashboard` - Dados agregados do dashboard
- `GET /api/dashboard/vendedores` - Performance dos vendedores
- `GET /api/dashboard/campanhas` - Performance das campanhas
- `GET /api/dashboard/leads` - Lista de leads
- `GET /api/dashboard/cache/status` - Status do cache
- `POST /api/dashboard/cache/clear` - Limpar cache

### tRPC API

- `/api/trpc` - Endpoint principal do tRPC
  - `auth.me` - Dados do usuário autenticado
  - `auth.logout` - Logout
  - `dashboard.getSalesData` - Dados de vendas

### OAuth

- `GET /api/oauth/callback` - Callback do OAuth

## 🔒 CORS

O backend está configurado para aceitar requisições apenas dos domínios listados em `ALLOWED_ORIGINS`. 

Para adicionar mais domínios, separe-os por vírgula:

```env
ALLOWED_ORIGINS=https://frontend1.vercel.app,https://frontend2.vercel.app,http://localhost:5173
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm start` - Inicia o servidor em modo produção
- `npm run check` - Verifica tipos TypeScript
- `npm run db:push` - Executa migrações do banco de dados

## 🐛 Troubleshooting

### Erro de CORS

Se o frontend não conseguir se conectar ao backend, verifique:

1. A variável `ALLOWED_ORIGINS` está configurada corretamente
2. A URL do frontend está incluída na lista
3. O protocolo (http/https) está correto

### Erro de Conexão com Banco de Dados

Verifique:

1. A `DATABASE_URL` está correta
2. O banco de dados está acessível
3. As credenciais estão corretas
4. As migrações foram executadas

### Erro no Deploy

1. Verifique os logs no Render Dashboard
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique se o build foi concluído com sucesso

## 📄 Licença

MIT
