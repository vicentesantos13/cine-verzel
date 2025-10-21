import { z } from "zod";

export const searchSchema = z.object({
  q: z.string().trim().min(1, "Digite ao menos 1 caractere"),
  window: z.enum(["day", "week"]).default("day"),
});

export type SearchFormValues = z.infer<typeof searchSchema>;