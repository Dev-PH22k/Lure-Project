# 🚀 Guia Rápido de Deploy

Este guia vai te ajudar a fazer o deploy do projeto em poucos passos.

## 📋 Pré-requisitos

- [ ] Conta no [Render](https://render.com) (para o backend)
- [ ] Conta na [Vercel](https://vercel.com) (para o frontend)
- [ ] Banco de dados MySQL (pode ser no próprio Render ou externo)
- [ ] Repositório Git com o código (GitHub, GitLab ou Bitbucket)

## 🎯 Passo a Passo

### Parte 1: Deploy do Backend no Render

#### 1.1. Preparar o Repositório

```bash
# Se ainda não tem um repositório Git:
cd backend/
git init
git add .
git commit -m "Initial commit - backend"
git remote add origin https://github.com/seu-usuario/lure-backend.git
git push -u origin main
```

#### 1.2. Criar Web Service no Render

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório Git
4. Configure:
   - **Name**: `lure-digital-backend`
   - **Region**: Escolha o mais próximo
   - **Branch**: `main`
   - **Root Directory**: `backend` (se o backend está em uma subpasta)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### 1.3. Configurar Banco de Dados

**Opção A: Criar MySQL no Render**

1. No Render, clique em **"New +"** → **"PostgreSQL"** (ou use serviço externo para MySQL)
2. Copie a URL de conexão

**Opção B: Usar serviço externo**

Recomendações:
- [PlanetScale](https://planetscale.com) - MySQL serverless (gratuito)
- [Railway](https://railway.app) - MySQL com plano gratuito
- [Aiven](https://aiven.io) - MySQL gerenciado

#### 1.4. Adicionar Variáveis de Ambiente

No Render, na seção **"Environment"**, adicione:

```
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://seu-frontend.vercel.app
DATABASE_URL=mysql://user:password@host:port/database
VITE_OAUTH_PORTAL_URL=https://oauth.manus.computer
VITE_APP_ID=seu-app-id-do-manus
OAUTH_CLIENT_SECRET=seu-client-secret-do-manus
```

**⚠️ IMPORTANTE**: Deixe `ALLOWED_ORIGINS` vazio por enquanto. Vamos adicionar a URL do frontend depois.

#### 1.5. Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build e deploy (5-10 minutos)
3. Copie a URL do backend (ex: `https://lure-digital-backend.onrender.com`)
4. Teste o health check: `https://seu-backend.onrender.com/health`

---

### Parte 2: Deploy do Frontend na Vercel

#### 2.1. Preparar o Repositório

```bash
# Se ainda não tem um repositório Git:
cd frontend/
git init
git add .
git commit -m "Initial commit - frontend"
git remote add origin https://github.com/seu-usuario/lure-frontend.git
git push -u origin main
```

#### 2.2. Importar Projeto na Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New..."** → **"Project"**
3. Importe seu repositório Git
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (se o frontend está em uma subpasta)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### 2.3. Adicionar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

```
VITE_API_URL=https://seu-backend.onrender.com
VITE_OAUTH_PORTAL_URL=https://oauth.manus.computer
VITE_APP_ID=seu-app-id-do-manus
```

**⚠️ Use a URL do backend que você copiou no passo 1.5**

#### 2.4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Copie a URL do frontend (ex: `https://lure-digital.vercel.app`)

---

### Parte 3: Conectar Backend e Frontend

#### 3.1. Atualizar CORS no Backend

1. Volte ao Render Dashboard
2. Acesse seu Web Service do backend
3. Vá em **"Environment"**
4. Edite a variável `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend-*.vercel.app
```

**Nota**: O padrão `*` permite preview deployments da Vercel.

5. Salve e aguarde o redeploy automático

#### 3.2. Executar Migrações do Banco

Se você ainda não executou as migrações:

**Opção A: Via Shell do Render**

1. No Render Dashboard, acesse seu Web Service
2. Clique em **"Shell"** no menu lateral
3. Execute:

```bash
npm run db:push
```

**Opção B: Localmente**

```bash
cd backend/
# Configure o .env com a DATABASE_URL de produção
npm run db:push
```

---

### Parte 4: Testar a Aplicação

#### 4.1. Teste o Backend

```bash
curl https://seu-backend.onrender.com/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

#### 4.2. Teste o Frontend

1. Acesse `https://seu-frontend.vercel.app`
2. Verifique se a página carrega sem erros
3. Abra o DevTools (F12) → Console
4. Não deve haver erros de CORS ou conexão
5. Teste fazer login
6. Verifique se os dados aparecem no dashboard

---

## ✅ Checklist Final

- [ ] Backend deployado no Render
- [ ] Backend respondendo em `/health`
- [ ] Banco de dados criado e acessível
- [ ] Migrações executadas
- [ ] Frontend deployado na Vercel
- [ ] Frontend carregando sem erros
- [ ] CORS configurado corretamente
- [ ] Login funcionando
- [ ] Dados carregando no dashboard

---

## 🐛 Problemas Comuns

### Backend não inicia no Render

**Verifique:**
- Logs no Render Dashboard
- Se todas as variáveis de ambiente estão configuradas
- Se o `DATABASE_URL` está correto
- Se o build foi bem-sucedido

### CORS Error no Frontend

**Solução:**
1. Confirme que `ALLOWED_ORIGINS` no backend contém a URL do frontend
2. Aguarde o redeploy do backend
3. Limpe o cache do navegador (Ctrl+Shift+R)

### Frontend não conecta ao Backend

**Verifique:**
- Se `VITE_API_URL` está configurado corretamente
- Se o backend está rodando (teste `/health`)
- Se não há typo na URL

### Banco de dados não conecta

**Verifique:**
- Se o `DATABASE_URL` está correto
- Se o banco está acessível publicamente
- Se as credenciais estão corretas
- Se o IP do Render está na whitelist (se aplicável)

---

## 📞 Precisa de Ajuda?

1. Consulte o [README principal](./README.md)
2. Consulte [backend/README.md](./backend/README.md)
3. Consulte [frontend/README.md](./frontend/README.md)
4. Verifique os logs no Render e Vercel
5. Abra uma issue no repositório

---

## 🎉 Pronto!

Seu dashboard está no ar! 🚀

- **Backend**: https://seu-backend.onrender.com
- **Frontend**: https://seu-frontend.vercel.app

Agora você pode:
- Compartilhar a URL com sua equipe
- Configurar um domínio customizado
- Monitorar logs e métricas
- Fazer updates via Git push
