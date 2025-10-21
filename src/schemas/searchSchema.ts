import { z } from "zod";

export const searchSchema = z.object({
  q: z.string().trim().min(1, "Digite ao menos 1 caractere"),
});

export type SearchFormValues = z.infer<typeof searchSchema>;