import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import {
  readSession,
  saveSession,
  removeSession,
} from "../src/services/session-storage.web";
import { confirmAction } from "../src/utils/confirm.web";
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
afterEach(() => {
  if (originalWindow)
    Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});
function browser() {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      sessionStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
      confirm: () => true,
    },
  });
  return values;
}
test("sessão web é salva, restaurada e removida sem SecureStore", async () => {
  browser();
  const session = {
    token: "teste",
    user: { id: "1", name: "Maria", role: "USER" },
  };
  await saveSession(session);
  assert.deepEqual(await readSession(), session);
  await removeSession();
  assert.equal(await readSession(), null);
});
test("sessão web inválida não autentica o usuário", async () => {
  const values = browser();
  values.set("eventos.session", "{invalido");
  assert.equal(await readSession(), null);
  values.set("eventos.session", JSON.stringify({ token: 3 }));
  assert.equal(await readSession(), null);
});
test("leitura de sessão durante renderização sem window retorna null", async () => {
  Reflect.deleteProperty(globalThis, "window");
  assert.equal(await readSession(), null);
});
test("confirmação web respeita aceitar e cancelar", async () => {
  browser();
  assert.equal(await confirmAction("Cancelar?", "Evento"), true);
  window.confirm = () => false;
  assert.equal(await confirmAction("Cancelar?", "Evento"), false);
});
