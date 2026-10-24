import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { api, ApiError, API_URL } from "../src/services/api";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("envia token Bearer para a rota correta sem depender de cookies", async () => {
  globalThis.fetch = (async (url, options) => {
    assert.equal(url, `${API_URL}/api/registrations`);
    assert.equal(
      new Headers(options?.headers).get("Authorization"),
      "Bearer token-teste",
    );
    assert.equal(options?.credentials, "omit");
    return new Response(JSON.stringify([{ id: "registration-1" }]), {
      status: 200,
    });
  }) as typeof fetch;
  assert.deepEqual(await api("/registrations", { token: "token-teste" }), [
    { id: "registration-1" },
  ]);
});

test("envia cadastro em JSON sem token administrativo", async () => {
  globalThis.fetch = (async (_url, options) => {
    assert.equal(options?.method, "POST");
    assert.equal(
      new Headers(options?.headers).get("Content-Type"),
      "application/json",
    );
    assert.equal(new Headers(options?.headers).has("Authorization"), false);
    assert.equal(
      JSON.parse(options?.body as string).email,
      "teste@example.com",
    );
    return new Response(JSON.stringify({ id: "user-1" }), { status: 201 });
  }) as typeof fetch;
  assert.deepEqual(
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Teste",
        email: "teste@example.com",
        password: "Senha123!",
      }),
    }),
    { id: "user-1" },
  );
});

test("cancelamento com resposta 204 não tenta ler JSON", async () => {
  globalThis.fetch = (async () =>
    new Response(null, { status: 204 })) as typeof fetch;
  assert.equal(
    await api("/registrations/1", { method: "DELETE", token: "token" }),
    undefined,
  );
});

test("preserva mensagem e status de inscrição duplicada", async () => {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ error: "Inscrição já cadastrada." }), {
      status: 409,
    })) as typeof fetch;
  await assert.rejects(
    () => api("/events/1/registrations", { method: "POST", token: "token" }),
    (error: unknown) =>
      error instanceof ApiError &&
      error.status === 409 &&
      error.message === "Inscrição já cadastrada.",
  );
});

test("preserva status 401 para o context encerrar a sessão", async () => {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ error: "Sessão expirada." }), {
      status: 401,
    })) as typeof fetch;
  await assert.rejects(
    () => api("/auth/me", { token: "invalido" }),
    (error: unknown) => error instanceof ApiError && error.status === 401,
  );
});

test("falha de rede apresenta uma mensagem de conexão", async () => {
  globalThis.fetch = (async () => {
    throw new TypeError("Network request failed");
  }) as typeof fetch;
  await assert.rejects(() => api("/events"), /Não foi possível conectar à API/);
});

test("resposta HTML avisa sobre o endereço da API", async () => {
  globalThis.fetch = (async () =>
    new Response("<html>Outra página</html>")) as typeof fetch;
  await assert.rejects(() => api("/events"), /resposta inesperada/);
});
