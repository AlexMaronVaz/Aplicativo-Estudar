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
      if (!data.trim()) return [];
      
      const lines = data.split("\n").filter(line => line.trim());
      const topics = [];

      for (const line of lines) {
        if (line.trim()) {
          // Formato: ID|texto
          const parts = line.split('|');
          if (parts.length === 2) {
            topics.push({
              id: parseInt(parts[0]),
              text: parts[1].trim(),
            });
          }
        }
      }
      return topics;
    } catch (error) {
      return [];
    }
  }

  async saveToFile(topics) {
    const lines = topics.map(topic => `${topic.id}|${topic.text}`).join("\n");
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
    
    topics.unshift(topic); // Adicionar no início para mostrar mais recentes primeiro
    await this.saveToFile(topics);
    
    return topic;
  }

  async deleteTopic(id) {
    const topics = await this.loadFromFile();
    console.log(`Deletando tópico ${id}. Tópicos atuais:`, topics.map(t => ({id: t.id, text: t.text.substring(0, 20)})));
    
    const initialLength = topics.length;
    const filteredTopics = topics.filter(topic => topic.id !== id);
    
    if (filteredTopics.length < initialLength) {
      await this.saveToFile(filteredTopics);
      console.log(`Tópico ${id} deletado com sucesso. Restantes:`, filteredTopics.length);
      return true;
    }
    console.log(`Tópico ${id} não encontrado. IDs disponíveis:`, topics.map(t => t.id));
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
      
      console.log('=== DELETE DEBUG ===');
      console.log('URL completa:', req.url);
      console.log('Query params:', req.query);
      console.log('ID recebido:', id);
      
      const topicId = parseInt(id);
      
      if (isNaN(topicId)) {
        console.log('❌ ID inválido:', id);
        return res.status(400).json({ message: "ID inválido" });
      }

      console.log('🔍 Tentando deletar ID:', topicId);
      
      // Debug: mostrar todos os tópicos antes de deletar
      const allTopics = await storage.getTopics();
      console.log('📋 Tópicos disponíveis:', allTopics.map(t => `ID:${t.id} - ${t.text.substring(0, 30)}`));
      
      const deleted = await storage.deleteTopic(topicId);
      
      if (deleted) {
        console.log('✅ Tópico deletado com sucesso');
        return res.status(200).json({ message: "Tópico removido com sucesso" });
      } else {
        console.log('❌ Tópico não encontrado para deletar');
        return res.status(404).json({ message: "Tópico não encontrado" });
      }
    }

    return res.status(405).json({ message: "Método não permitido" });

  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}