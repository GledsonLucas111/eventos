# Eventos — Aplicativo mobile

Aplicativo simples de eventos feito com React Native, Expo SDK 58, Expo Router e TypeScript. Usa a autenticação própria e os endpoints do projeto `eventos-web` entregue anteriormente, sem Clerk.

A organização segue os exemplos das aulas: `src/app`, `src/context`, `src/hooks`, providers envolvendo `Slot` no `_layout.tsx`, hooks com `useContext`, telas com `useState` e listas com `FlatList`. A estilização usa `StyleSheet`, como nas imagens de referência. O Tailwind permanece no projeto web.

## Funcionalidades

- Cadastro de usuário com nome, e-mail e senha.
- Login e logout.
- Lista de eventos disponíveis e detalhes.
- Inscrição em um evento.
- Lista das inscrições do usuário e cancelamento com confirmação.
- Sessão compartilhada com Context API e salva com Expo SecureStore.
- Rotas protegidas e saída da sessão quando a API retorna 401.
- Mensagens de carregamento, erros e atualização das listas puxando a tela.
- O aplicativo não possui cadastro, edição ou exclusão de eventos. A API também exige ADMIN nessas operações.

## O que é necessário

- Node.js 22.13+ (linha 22 LTS), Node.js 24.3+ (linha 24 LTS), ou versão compatível com `engines` no `package.json`.
- npm.
- Projeto `eventos-web` configurado e PostgreSQL em execução.
- Android Studio com um emulador Android (AVD) iniciado, ou um celular com Expo Go compatível com o SDK 58.

O ZIP contém o código mobile. O backend é o projeto `eventos-web` já entregue; não há PostgreSQL nem Prisma dentro do aplicativo.

## 1. Iniciar o backend

Abra um terminal na pasta `eventos-web`. Se já está configurado e com o banco preparado, basta:

```sh
npm run dev -- --hostname 0.0.0.0
```

Se for a primeira execução do backend:

```sh
npm ci
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev -- --hostname 0.0.0.0
```

O `.env` do backend deve continuar com `DATABASE_URL`, `JWT_SECRET` e as credenciais do administrador. Use o PostgreSQL que já está rodando no seu Docker. Docker Compose não é necessário se esse container já está configurado.

Acesse http://localhost:3000 no computador, entre como administrador e cadastre pelo menos um evento, com uma imagem HTTP/HTTPS pública. Sem eventos cadastrados, o mobile exibirá a lista vazia.

## 2. Configurar o mobile

Extraia o ZIP. Abra outro terminal na pasta `eventos-mobile`:

```sh
npm ci
```

Crie `.env` a partir do exemplo. Linux/macOS:

```sh
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Para o emulador Android padrão do Android Studio, use:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

Não adicione `/api` ao final: o arquivo `src/services/api.ts` já acrescenta esse prefixo.

| Onde o aplicativo executa | URL do backend |
| --- | --- |
| Android Studio Emulator | `http://10.0.2.2:3000` |
| Celular físico na mesma rede | `http://IP_DO_COMPUTADOR:3000` |
| Simulador iOS no macOS | `http://localhost:3000` |

`10.0.2.2` é o endereço usado pelo emulador Android padrão para acessar o computador. Se você utiliza WSL, Docker para o Next.js, outro emulador ou uma configuração de rede diferente, confirme que a porta 3000 do servidor é acessível pelo emulador. Em celular físico, computador e celular precisam estar na mesma rede e o firewall deve permitir a porta 3000.

O `.env` mobile contém somente o endereço público da API. Ele não precisa da URL do banco, JWT_SECRET ou senha do administrador.

## 3. Executar no emulador Android

1. Abra o Android Studio.
2. No Device Manager, inicie um dispositivo virtual (AVD).
3. Com o backend rodando em outro terminal, execute na pasta mobile:

```sh
npm run android
```

Também pode iniciar o Expo primeiro:

```sh
npx expo start
```

Depois pressione `a` para abrir o Android. Mantenha o terminal do Expo aberto. Se `adb` não for encontrado, configure o Android SDK e o `platform-tools` no PATH ou use a configuração de Android indicada pelo Expo para o seu sistema.

Para um celular físico, inicie com `npx expo start`, abra o QR code no Expo Go compatível e use o IP do computador no `.env`.

Se mudar o endereço no `.env`, encerre o Expo com Ctrl+C e reinicie:

```sh
npx expo start --clear
```

## Visualizar no navegador (Expo Web)

Esta versão inclui `react-native-web`, React DOM e o runtime Metro para web. No navegador a sessão usa `sessionStorage`; no Android/iOS continua usando SecureStore. As confirmações de cancelamento também possuem implementação para navegador.

1. No backend `eventos-web`, aplique a configuração de `backend/next.config.mjs` deste pacote ao arquivo `next.config.mjs` do backend. O projeto original tinha uma configuração vazia. Se você adicionou outras opções, preserve-as e incorpore o método `headers()`. Não crie dois arquivos `next.config` no mesmo backend.
2. Reinicie o backend com `npm run dev`. O CORS de desenvolvimento permitirá `http://localhost:8081`. Para outra origem, configure `MOBILE_WEB_ORIGIN` no `.env` do backend. Essa liberação só é aplicada em desenvolvimento.
3. No `.env` mobile, use:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

4. No terminal mobile:

```sh
npm run web -- --clear
```

5. Abra `http://localhost:8081` no navegador do Windows. O WSL geralmente encaminha o acesso do Windows a `localhost` automaticamente. Abra primeiro `http://localhost:3000/api/events` para conferir que a API está acessível.

O celular físico continua usando o IP do Windows/rede, não `localhost`. Ao trocar entre navegador e celular, ajuste `EXPO_PUBLIC_API_URL` e reinicie o Expo com `--clear`.

Para corrigir apenas a dependência ausente em uma instalação anterior, o comando é `npx expo install react-native-web react-dom @expo/metro-runtime`. A instalação, sozinha, não fornece o fallback de armazenamento web nem configura o CORS no backend.


## 4. Roteiro de uso

1. Abra o aplicativo e toque em **Cadastre-se**.
2. Informe nome, e-mail, senha com pelo menos 8 caracteres e confirmação.
3. Após o cadastro, faça login com a conta criada.
4. Na lista, abra um evento.
5. Toque em **Inscrever-me**.
6. Volte e abra **Minhas inscrições**.
7. Confira o evento e cancele a inscrição, se desejar.
8. Na tela inicial, toque em **Sair**.

Não é necessário cadastrar a conta mobile pelo painel web. O cadastro utiliza `POST /api/auth/register`, que cria um usuário comum. Ao entrar no mobile com uma conta ADMIN, o aplicativo continua exibindo somente as funcionalidades de participação; a permissão administrativa pertence à conta na API, não ao dispositivo.

## Estrutura

```text
src/
  app/
    _layout.tsx
    index.tsx
    (auth)/
      _layout.tsx
      login.tsx
      register.tsx
    (app)/
      _layout.tsx
      events/
        index.tsx
        [id].tsx
      registrations.tsx
  context/
    auth-context.tsx
    registration-context.tsx
  hooks/
    use-auth.ts
    use-registrations.ts
  components/
    button.tsx
    input.tsx
    form-screen.tsx
    event-card.tsx
    event-image.tsx
    feedback.tsx
  services/
    api.ts
    session-storage.ts
  types/
    event.ts
  styles/
    theme.ts
  utils/
    format-date.ts
```

### Como funciona

- `AuthProvider` centraliza usuário, token, login, cadastro, logout e requisições autenticadas. `useAuth` lê esse contexto.
- `RegistrationProvider` centraliza as inscrições, carregamento, inscrição e cancelamento. `useRegistrations` lê esse contexto.
- Ao trocar de usuário, o provider de inscrições é recriado para não exibir dados da conta anterior.
- `_layout.tsx` envolve as telas com os providers, como o `CartProvider` do exemplo.
- `(auth)/_layout.tsx` direciona quem já está autenticado para os eventos.
- `(app)/_layout.tsx` direciona quem não está autenticado para o login.
- `services/api.ts` usa `fetch`, acrescenta `/api`, envia o Bearer token, aplica timeout e trata erros. Não depende de cookies do navegador.
- A sessão é restaurada pelo SecureStore e validada em `/auth/me`. Em falha de rede, mantém a sessão local para permitir tentar novamente; a API continua validando o token em cada operação. Em 401, a sessão é encerrada.

## Endpoints consumidos

| Método | Endpoint | Uso |
| --- | --- | --- |
| POST | /api/auth/register | Cadastro |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Validar a sessão salva |
| GET | /api/events | Listar eventos |
| GET | /api/events/:id | Detalhes |
| GET | /api/registrations | Minhas inscrições |
| POST | /api/events/:id/registrations | Inscrição |
| DELETE | /api/registrations/:id | Cancelamento |

O logout descarta o token do dispositivo. Conforme o backend existente, JWTs já emitidos expiram após 24 horas; não há revogação imediata no servidor. O aplicativo não chama `/api/auth/logout` porque essa rota é destinada a remover o cookie web.

## Verificações

```sh
npm run typecheck
npm test
npm run export:android
npm run export:web
```

A checagem TypeScript, testes do cliente HTTP e de armazenamento web com respostas simuladas e a geração dos bundles Android e Web foram executadas. Não foi possível executar um emulador, verificar a interface no navegador nem testar os fluxos completos contra PostgreSQL neste ambiente. O bundle exportado confirma a compilação JavaScript/TypeScript; não é um APK e não comprova a execução nativa.

Os testes verificam envio do token, cadastro JSON, cancelamento 204, erro de inscrição duplicada, status 401, falha de rede e resposta inesperada. Não acessam o banco nem criam contas reais.

## Problemas comuns

- **Network request failed / não conectou:** verifique se o Next.js está rodando na porta correta, se o `.env` usa o endereço do dispositivo e se a rede/firewall permitem o acesso.
- **Lista vazia:** cadastre eventos no painel web e confira se está usando o mesmo backend/banco.
- **Usuário não existe:** cadastre-se no aplicativo ou use uma conta criada pela mesma API.
- **Sessão expirada:** faça login novamente.
- **Imagem não aparece:** use uma imagem pública acessível também no emulador/celular; o app mostra um fallback se o carregamento falhar.
- **Expo Go incompatível:** use uma versão compatível com o SDK informado no projeto. Este projeto usa Expo SDK 58.

Este aplicativo mantém o escopo da atividade: sem Clerk, sem cadastro administrativo de eventos e sem serviços pagos necessários.
