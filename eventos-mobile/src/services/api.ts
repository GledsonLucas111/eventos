export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = RequestInit & { token?: string };

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { token, ...requestOptions } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  const headers = new Headers(requestOptions.headers);

  headers.set("Accept", "application/json");

  if (requestOptions.body) headers.set("Content-Type", "application/json");

  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(`${API_URL}/api${path}`, {
      ...requestOptions,
      headers,
      credentials: "omit",
      signal: controller.signal,
    });

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    let data: unknown;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new ApiError(
        "A API retornou uma resposta inesperada. Confira o endereço configurado.",
        response.status,
      );
    }
    if (!response.ok) {
      const message =
        data &&
        typeof data === "object" &&
        "error" in data &&
        typeof data.error === "string"
          ? data.error
          : "Não foi possível concluir a operação.";
      throw new ApiError(message, response.status);

    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (controller.signal.aborted)
      throw new Error(
        "A conexão demorou demais. Confira a API e tente novamente.",
      );
    throw new Error(
      "Não foi possível conectar à API. Confira a URL, o servidor e a conexão de rede.",
    );
    
  } finally {
    clearTimeout(timeout);
  }
}
