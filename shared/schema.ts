import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
});

export const insertTopicSchema = createInsertSchema(topics).pick({
  text: true,
}).extend({
  text: z.string().min(1, "O tópico não pode estar vazio").max(500, "O tópico deve ter no máximo 500 caracteres"),
});

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topics.$inferSelect;
