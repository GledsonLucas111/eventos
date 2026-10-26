import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Título deve ter pelo menos 3 caracteres.")
    .max(120),
  description: z
    .string()
    .trim()
    .min(5, "Descrição deve ter pelo menos 5 caracteres.")
    .max(5000),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.")
    .refine((s) => {
      const d = new Date(s + "T12:00:00Z");
      return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
    }, "Data inválida."),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido."),
  location: z.string().trim().min(3, "Informe o local.").max(200),
  image: z
    .string()
    .url("Informe uma URL de imagem válida.")
    .max(2000)
    .refine((s) => /^https?:\/\//.test(s), "Use uma imagem HTTP ou HTTPS."),
});
