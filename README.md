# Financy
Aplicação para gerenciamento de finanças pessoais. Permite criar e gerenciar transações e categorias, com autenticação de usuário.
## Tecnologias
### Backend
- Node.js + TypeScript
- GraphQL + Type-GraphQL
- Apollo Server
- Prisma + SQLite
- JWT para autenticação

### Frontend
- React + TypeScript
- Vite
- Apollo Client (GraphQL)
- Zustand (gerenciamento de estado)
- TailwindCSS + Shadcn/ui
-React Hook Form + Zod

## Estrutura do repositório
```
/
├── backend/
└── frontend/
```
## Como rodar
### Backend
Acesse a pasta do backend:
```bash
cd backend
```
Instale as dependências:
```bash
npm install
```
Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Preencha as variáveis no `.env`:
```
DATABASE_URL=file:./dev.db
JWT_SECRET=sua_chave_secreta
JWT_REFRESH_SECRET=sua_chave_refresh_secreta
FRONTEND_URL=http://localhost:5173
```
Execute as migrations do banco de dados:
```bash
npx prisma migrate dev
```
Inicie o servidor:
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:4000/graphql`.
---
### Frontend
Acesse a pasta do frontend:
```bash
cd frontend
```
Instale as dependências:
```bash
npm install
```
Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Preencha as variáveis no `.env`:
```
VITE_BACKEND_URL=http://localhost:4000/graphql
```
Inicie a aplicação:
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`.
