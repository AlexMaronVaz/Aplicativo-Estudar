import fs from 'fs/promises';

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
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    try {
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
    } catch (error) {
      console.error("Erro ao deletar tópico:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}