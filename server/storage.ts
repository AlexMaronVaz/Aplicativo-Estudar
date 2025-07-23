import { type Topic, type InsertTopic } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getTopics(): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  deleteTopic(id: number): Promise<boolean>;
}

// Removido DatabaseStorage - agora usando apenas FileStorage

export class FileStorage implements IStorage {
  private filePath: string;
  private topics: Map<number, Topic>;

  constructor() {
    this.filePath = path.resolve(process.cwd(), "topics.txt");
    this.topics = new Map();
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      await this.loadFromFile();
    } catch (error) {
      // File doesn't exist yet, start with empty storage
      console.log("Topics file not found, starting with empty storage");
    }
  }

  private async loadFromFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const lines = data.split("\n").filter(line => line.trim());
      
      this.topics.clear();

      for (const line of lines) {
        if (line.trim()) {
          try {
            // Tenta carregar como JSON (formato novo)
            const topic = JSON.parse(line.trim());
            this.topics.set(topic.id, topic);
          } catch (parseError) {
            // Compatibilidade: trata como texto simples
            const id = Date.now() + Math.random() * 1000;
            this.topics.set(id, { id, text: line.trim() });
          }
        }
      }
    } catch (error) {
      // Arquivo não existe
      this.topics.clear();
    }
  }

  private async saveToFile() {
    const lines = Array.from(this.topics.values())
      .map(topic => JSON.stringify(topic))
      .join("\n");
    
    await fs.writeFile(this.filePath, lines, "utf-8");
  }

  async getTopics(): Promise<Topic[]> {
    await this.loadFromFile(); // Reload to get latest data
    return Array.from(this.topics.values()).reverse(); // Show newest first
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const topic: Topic = {
      id: Date.now(), // Usar timestamp para garantir unicidade
      text: insertTopic.text.trim(),
    };
    
    this.topics.set(topic.id, topic);
    await this.saveToFile();
    
    console.log('✅ Tópico criado:', topic);
    return topic;
  }

  async deleteTopic(id: number): Promise<boolean> {
    console.log(`🔍 Tentando deletar ID: ${id} (tipo: ${typeof id})`);
    console.log(`📋 Tópicos disponíveis:`, Array.from(this.topics.keys()));
    
    const deleted = this.topics.delete(id);
    if (deleted) {
      await this.saveToFile();
      console.log(`✅ Tópico ${id} deletado com sucesso`);
    } else {
      console.log(`❌ Tópico ${id} não encontrado`);
    }
    return deleted;
  }
}

export const storage = new FileStorage();
