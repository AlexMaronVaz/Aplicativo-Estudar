import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// Schema de validação
const insertTopicSchema = z.object({
  text: z.string().min(1, "O tópico não pode estar vazio").max(500, "O tópico deve ter no máximo 500 caracteres")
});

// Classe de armazenamento em arquivo
class FileStorage {
  constructor() {
    this.filePath = '/tmp/topics.txt';
  }

  async loadFromFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const lines = data.split("\n").filter(line => line.trim());
      
      const topics = [];
      let currentId = 1;

      for (const line of lines) {
        if (line.trim()) {
          topics.push({
            id: currentId++,
            text: line.trim(),
          });
        }
      }
      return topics;
    } catch (error) {
      return [];
    }
  }

  async saveToFile(topics) {
    const lines = topics.map(topic => topic.text).join("\n");
    await fs.writeFile(this.filePath, lines, "utf-8");
  }

  async getTopics() {
    const topics = await this.loadFromFile();
    return topics.reverse(); // Mostrar mais recentes primeiro
  }

  async createTopic(insertTopic) {
    const topics = await this.loadFromFile();
    const newId = topics.length > 0 ? Math.max(...topics.map(t => t.id)) + 1 : 1;
    
    const topic = {
      id: newId,
      text: insertTopic.text.trim(),
    };
    
    topics.push(topic);
    await this.saveToFile(topics);
    
    return topic;
  }

  async deleteTopic(id) {
    const topics = await this.loadFromFile();
    const initialLength = topics.length;
    const filteredTopics = topics.filter(topic => topic.id !== id);
    
    if (filteredTopics.length < initialLength) {
      await this.saveToFile(filteredTopics);
      return true;
    }
    return false;
  }
}

const storage = new FileStorage();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const topics = await storage.getTopics();
      return res.status(200).json(topics);
    }

    if (req.method === 'POST') {
      try {
        const validatedData = insertTopicSchema.parse(req.body);
        const topic = await storage.createTopic(validatedData);
        return res.status(201).json(topic);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ 
            message: "Dados inválidos", 
            errors: error.errors.map(e => e.message) 
          });
        }
        throw error;
      }
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const topicId = parseInt(id);
      
      if (isNaN(topicId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const deleted = await storage.deleteTopic(topicId);
      if (deleted) {
        return res.status(200).json({ message: "Tópico removido com sucesso" });
      } else {
        return res.status(404).json({ message: "Tópico não encontrado" });
      }
    }

    return res.status(405).json({ message: "Método não permitido" });

  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}