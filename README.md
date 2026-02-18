# Lure Digital Dashboard

Dashboard de vendas e métricas para a Lure Digital, com integração ao Google Sheets e visualizações em tempo real.

## 📦 Estrutura do Projeto

Este projeto foi reestruturado para separar o backend e frontend, permitindo deploy independente:

```
lure-digital-separated/
├── backend/          # API Express + tRPC + MySQL
│   ├── server/       # Código do servidor
│   ├── drizzle/      # Schemas e migrações do banco
│   ├── shared/       # Tipos compartilhados
│   └── README.md     # Instruções do backend
│
└── frontend/         # React + Vite + Tailwind
    ├── src/          # Código fonte
    ├── public/       # Assets estáticos
    ├── shared/       # Tipos compartilhados
    └── README.md     # Instruções do frontend
```

## 🚀 Deploy

### Backend → Render

O backend deve ser hospedado no **Render**:

1. Acesse a pasta `backend/`
2. Siga as instruções em `backend/README.md`
3. Configure as variáveis de ambiente
4. Deploy via Git ou Dashboard do Render

**URL de exemplo**: `https://lure-digital-backend.onrender.com`

### Frontend → Vercel

O frontend deve ser hospedado na **Vercel**:

1. Acesse a pasta `frontend/`
2. Siga as instruções em `frontend/README.md`
3. Configure `VITE_API_URL` com a URL do backend
4. Deploy via Git ou CLI da Vercel

**URL de exemplo**: `https://lure-digital.vercel.app`

## 🔧 Desenvolvimento Local

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure o .env
npm run dev
```

O backend estará em `http://localhost:3000`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Deixe VITE_API_URL vazio para usar proxy
npm run dev
```

O frontend estará em `http://localhost:5173`

## 🔗 Conectando Backend e Frontend

### Em Desenvolvimento

O Vite faz proxy automático das requisições `/api/*` para o backend local. Não precisa configurar `VITE_API_URL`.

### Em Produção

1. **Deploy do Backend primeiro** no Render
2. Copie a URL do backend (ex: `https://seu-backend.onrender.com`)
3. Configure no frontend na Vercel:
   - `VITE_API_URL=https://seu-backend.onrender.com`
4. Adicione a URL do frontend no backend:
   - `ALLOWED_ORIGINS=https://seu-frontend.vercel.app`

## 🔒 Variáveis de Ambiente

### Backend (.env)

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://seu-frontend.vercel.app
DATABASE_URL=mysql://user:pass@host:port/db
VITE_OAUTH_PORTAL_URL=https://oauth.manus.computer
VITE_APP_ID=seu-app-id
OAUTH_CLIENT_SECRET=seu-secret
```

### Frontend (.env)

```env
VITE_API_URL=https://seu-backend.onrender.com
VITE_OAUTH_PORTAL_URL=https://oauth.manus.computer
VITE_APP_ID=seu-app-id
```

## 📋 Checklist de Deploy

- [ ] Backend deployado no Render
- [ ] Banco de dados MySQL configurado
- [ ] Variáveis de ambiente do backend configuradas
- [ ] Migrações do banco executadas (`npm run db:push`)
- [ ] Health check do backend funcionando (`/health`)
- [ ] Frontend deployado na Vercel
- [ ] `VITE_API_URL` configurado no frontend
- [ ] URL do frontend adicionada em `ALLOWED_ORIGINS` no backend
- [ ] Teste de login funcionando
- [ ] Teste de requisições à API funcionando

## 🧪 Testando a Integração

### 1. Teste o Backend

```bash
curl https://seu-backend.onrender.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T..."
}
```

### 2. Teste o Frontend

Acesse `https://seu-frontend.vercel.app` e:

1. Verifique se a página carrega
2. Tente fazer login
3. Verifique se os dados aparecem no dashboard
4. Abra o DevTools e verifique se não há erros de CORS

## 🐛 Problemas Comuns

### CORS Error

**Sintoma**: Erro no console do navegador sobre CORS

**Solução**: 
1. Adicione a URL do frontend em `ALLOWED_ORIGINS` no backend
2. Reinicie o backend
3. Limpe o cache do navegador

### 502 Bad Gateway no Render

**Sintoma**: Backend não responde

**Solução**:
1. Verifique os logs no Render Dashboard
2. Confirme que o build foi bem-sucedido
3. Verifique se todas as variáveis de ambiente estão configuradas
4. Teste o health check

### Frontend não conecta ao Backend

**Sintoma**: Dados não carregam, timeout

**Solução**:
1. Verifique se `VITE_API_URL` está correto
2. Teste o backend diretamente com curl
3. Verifique se o backend está rodando
4. Confirme que não há firewall bloqueando

## 📚 Documentação Adicional

- [Backend README](./backend/README.md) - Detalhes da API e deploy no Render
- [Frontend README](./frontend/README.md) - Detalhes do UI e deploy na Vercel
- [Render Docs](https://render.com/docs) - Documentação do Render
- [Vercel Docs](https://vercel.com/docs) - Documentação da Vercel

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 💬 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação em `backend/README.md` e `frontend/README.md`
2. Consulte a seção de Troubleshooting
3. Abra uma issue no repositório


Kaio Felipe - Paulo Henrique