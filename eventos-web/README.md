# Plataforma de Eventos — Web e API

Sistema acadêmico simples em Next.js, TypeScript, Tailwind CSS 4, Prisma 7 e PostgreSQL. Implementa a parte web e a API REST; não inclui o aplicativo mobile.

## Organização baseada no projeto de referência

O código usa a organização do projeto `list_tasks`: código em `src/`, operações em `actions/`, componentes específicos das páginas em `_components/` e cliente Prisma em `lib/prisma.ts`.

- `src/app/(auth)/login/`: página de login e seu componente interativo.
- `src/app/dashboard/layout.tsx`: cabeçalho e proteção administrativa.
- `src/app/dashboard/page.tsx`: consulta e lista os eventos no servidor.
- `src/app/dashboard/new/`: cadastro de evento.
- `src/app/dashboard/[id]/`: detalhes do evento.
- `src/app/dashboard/[id]/edit/`: edição de evento.
- `src/app/dashboard/_components/`: formulário, cartão e botão de exclusão.
- `src/app/api/`: endpoints REST para o futuro aplicativo mobile.
- `src/actions/events.ts`: Server Actions de criação, atualização e exclusão.
- `src/actions/auth.ts`: login e logout da interface web.
- `src/components/`: campos visuais dos formulários e imagem com fallback.
- `src/lib/prisma.ts`: PrismaClient com adaptador PostgreSQL e reutilização no desenvolvimento.
- `src/lib/session.ts`: leitura da sessão e verificação de administrador nas páginas e ações.
- `src/lib/api.ts`: autenticação da API por Bearer/cookie, geração de token e tratamento de erros.
- `src/lib/validations.ts`: validação dos eventos, compartilhada pelas actions e API.
- `src/types/event.ts`: tipos compartilhados.
- `prisma/`: schema, migrations e seed do administrador.
- `prisma.config.ts`: configuração do Prisma 7, conexão e seed.
- `tests/api.test.ts`: testes de validação e restrições de acesso com banco simulado.

### Comunicação com o backend

Na interface web, as páginas consultam o Prisma diretamente no servidor. Os componentes de formulário chamam as funções de `src/actions/`, que validam os dados, conferem a sessão/permissão, gravam no banco e revalidam o dashboard. Não há uma página única controlando todas as telas por estados.

O mobile deve usar `fetch` para chamar as rotas `/api/...`; ele não chama Server Actions. A API continua disponível independentemente do dashboard. Tanto a API quanto as Server Actions protegem as operações de gerenciamento: esconder um botão não é a proteção de acesso.

## Funcionalidades

- Login e logout do administrador com autenticação própria, sem Clerk.
- Lista e busca de eventos por título ou local.
- Cadastro, detalhes, edição e exclusão com confirmação.
- Campos id, título, descrição, data, horário, local e URL de imagem.
- Estados de carregamento, erros de formulário e erro de carregamento do dashboard.
- API de usuários e inscrições, incluindo cancelamento e bloqueio de inscrições duplicadas.
- Senhas com bcrypt, JWT válido por 24 horas e cookie HttpOnly na web.
- Cadastro público cria somente usuários comuns. Somente ADMIN gerencia eventos.

## Requisitos

- Node.js 22 LTS atualizado (22.12+), ou Node.js 24.
- npm.
- PostgreSQL disponível. Docker é opcional.

## Executar no seu PostgreSQL existente

1. Extraia o ZIP e abra o terminal na pasta `eventos-web`.

2. Instale as dependências:

```sh
npm ci
```

3. Copie `.env.example` para `.env` e ajuste as variáveis. Linux/macOS:

```sh
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Exemplo de conexão para o banco que você já criou:

```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/SEU_BANCO?schema=public"
JWT_SECRET="substitua-por-uma-chave-aleatoria-com-32-caracteres-ou-mais"
ADMIN_EMAIL="admin@eventos.com"
ADMIN_PASSWORD="Admin123!"
```

Use a porta que seu container expõe. Se sua senha tiver caracteres reservados em URLs, codifique esses caracteres na URL de conexão. Não publique o `.env`.

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

Não precisa usar Docker Compose se seu container já está configurado. Para quem quiser criar um PostgreSQL novo pelo arquivo incluído, execute `docker compose up -d` antes das migrations e use as credenciais do `.env.example`.

### Se já usava a versão anterior do sistema de eventos

Mantenha seu banco e copie seu `.env` para a nova pasta. Os modelos e a migration inicial foram preservados: não é necessário apagar dados nem executar `prisma migrate reset`. Se a migration inicial já foi aplicada, `prisma migrate deploy` não a aplica novamente. Isso se refere ao banco do sistema de eventos; o banco do projeto de compras não tem os mesmos modelos.

O seed é idempotente: não altera uma conta com o mesmo e-mail. Mudar `ADMIN_PASSWORD` e executar o seed novamente não redefine uma senha já cadastrada. As credenciais do Clerk presentes no projeto de referência não são usadas por este sistema.

## Roteiro de demonstração

1. Entrar como administrador.
2. Clicar em Novo evento e preencher todos os campos.
3. Usar uma URL pública HTTP/HTTPS de imagem e salvar.
4. Conferir a lista e buscar pelo título ou local.
5. Abrir Detalhes e depois Editar evento.
6. Alterar dados, salvar e conferir a lista.
7. Clicar em Excluir e confirmar.
8. Sair da sessão.

As imagens são URLs; não há upload. Datas e horários representam o horário local do evento, sem conversão de fuso. A lista começa vazia.

## API REST

Corpos de requisição em JSON. Respostas de erro usam `{ "error": "mensagem" }`.

| Método | Endpoint | Acesso |
| --- | --- | --- |
| GET | /api/events | Público |
| GET | /api/events/:id | Público |
| POST | /api/events | Administrador |
| PUT | /api/events/:id | Administrador |
| DELETE | /api/events/:id | Administrador |
| POST | /api/auth/register | Público |
| POST | /api/auth/login | Público |
| GET | /api/auth/me | Autenticado |
| POST | /api/auth/logout | Remove o cookie web |
| GET | /api/registrations | Somente inscrições do usuário autenticado |
| POST | /api/events/:id/registrations | Autenticado |
| DELETE | /api/registrations/:id | Somente a própria inscrição |

Cadastro de usuário comum:

```json
{ "name": "Maria Silva", "email": "maria@exemplo.com", "password": "Senha123!" }
```

Login pela API:

```json
{ "email": "maria@exemplo.com", "password": "Senha123!" }
```

A API retorna `{ token, user }`. O mobile envia `Authorization: Bearer TOKEN` nas rotas protegidas. O usuário comum pode entrar pela API, mas não acessa o painel administrativo. No mobile, o logout deve descartar o token; a rota de logout remove o cookie web e não revoga tokens JWT já emitidos, que expiram em 24 horas.

Cadastro ou edição de evento (PUT exige todos os campos):

```json
{
  "title": "Encontro de tecnologia",
  "description": "Uma tarde para compartilhar conhecimentos.",
  "date": "2026-10-26",
  "time": "14:00",
  "location": "Auditório da escola",
  "image": "https://exemplo.com/evento.jpg"
}
```

Substitua a URL de exemplo por uma imagem pública real. A inscrição usa POST sem corpo. Inscrição duplicada retorna 409; evento ausente retorna 404; acesso sem autenticação retorna 401; gerenciamento por usuário comum retorna 403. Excluir um evento também exclui as inscrições relacionadas.

### Conectar o futuro mobile localmente

- Android Studio Emulator: `http://10.0.2.2:3000`.
- Celular físico: `http://IP_DO_COMPUTADOR:3000`, na mesma rede.
- Expo Web no mesmo computador: `http://localhost:3000` (origens diferentes podem exigir configuração de CORS).

Para aceitar conexões da rede:

```sh
npm run dev -- --hostname 0.0.0.0
```

## Verificações

Após configurar `.env` e gerar o cliente:

```sh
npm run typecheck
npm test
npm run build
```

`npm test` usa banco simulado para verificar validação, acesso sem login, token inválido, bloqueio de usuário comum e tentativa de cadastrar ADMIN pela rota pública. Não grava no PostgreSQL.

Para executar o build local:

```sh
npm start
```

Build, schema Prisma e testes automatizados foram verificados na entrega. Os fluxos completos com PostgreSQL e a aparência no navegador não foram verificados neste ambiente; devem ser conferidos após configurar o banco local. O projeto tem escopo acadêmico: não inclui aplicativo mobile, recuperação de senha ou envio de e-mails.
