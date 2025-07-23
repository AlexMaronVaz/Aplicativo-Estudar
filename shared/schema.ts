import { z } from "zod";

// Schema simplificado para arquivo .txt
export const insertTopicSchema = z.object({
  text: z.string().min(1, "O tópico não pode estar vazio").max(500, "O tópico deve ter no máximo 500 caracteres"),
});

export type Topic = {
  id: number;
  text: string;
};

export type InsertTopic = z.infer<typeof insertTopicSchema>;
