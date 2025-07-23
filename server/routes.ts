import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTopicSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all topics
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ message: "Erro ao buscar tópicos" });
    }
  });

  // Create a new topic
  app.post("/api/topics", async (req, res) => {
    try {
      const validatedData = insertTopicSchema.parse(req.body);
      const topic = await storage.createTopic(validatedData);
      res.status(201).json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Dados inválidos", 
          errors: error.errors.map(e => e.message) 
        });
      } else {
        console.error("Error creating topic:", error);
        res.status(500).json({ message: "Erro ao criar tópico" });
      }
    }
  });

  // Delete a topic
  app.delete("/api/topics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const deleted = await storage.deleteTopic(id);
      if (deleted) {
        res.json({ message: "Tópico removido com sucesso" });
      } else {
        res.status(404).json({ message: "Tópico não encontrado" });
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      res.status(500).json({ message: "Erro ao remover tópico" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
