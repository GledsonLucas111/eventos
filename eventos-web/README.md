# Plataforma de Eventos — Web e API

Sistema de gerenciamneto de evento, criado em Next.js, TypeScript, Tailwind CSS 4, Prisma 7 e PostgreSQL. 

## Como Executar o Projeto

1. Instale as dependências:

```sh
npm i
```

3. Copie `.env.example` para `.env` e ajuste as variáveis:

```sh
cp .env.example .env
```
4. Gere o cliente, aplique as migrations existentes e crie o administrador:

```sh
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

5. Inicie:

```sh
npm run dev
```

6. Acesse http://localhost:3000. O sistema redireciona para `/login` ou `/dashboard`, conforme a sessão. Entre usando as credenciais do `.env`.
