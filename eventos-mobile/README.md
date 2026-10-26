# Eventos — Aplicativo mobile

Aplicativo simples de eventos feito com React Native, Expo SDK 58, Expo Router e TypeScript. Usa a autenticação própria e os endpoints do projeto `eventos-web` entregue anteriormente, sem Clerk.

A organização segue os exemplos das aulas: `src/app`, `src/context`, `src/hooks`, providers envolvendo `Slot` no `_layout.tsx`, hooks com `useContext`, telas com `useState` e listas com `FlatList`. A estilização usa `StyleSheet`, como nas imagens de referência. O Tailwind permanece no projeto web.

## 2. Configurar o mobile

Instale as dependencias
```sh
npm i
```

Crie `.env` a partir do exemplo:

```sh
cp .env.example .env
```

Para o emulador Android padrão do Android Studio, use:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```


| Onde o aplicativo executa | URL do backend |
| --- | --- |
| Android Studio Emulator | `http://10.0.2.2:3000` |
| Celular físico na mesma rede | `http://IP_DO_COMPUTADOR:3000` |
| Simulador iOS no macOS | `http://localhost:3000` |

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