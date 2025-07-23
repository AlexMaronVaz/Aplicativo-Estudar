import { topics, type Topic, type InsertTopic } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getTopics(): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  deleteTopic(id: number): Promise<boolean>;
}

export class FileStorage implements IStorage {
  private filePath: string;
  private topics: Map<number, Topic>;
  private currentId: number;

  constructor() {
    this.filePath = path.resolve(process.cwd(), "topics.txt");
    this.topics = new Map();
    this.currentId = 1;
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
      this.currentId = 1;

      for (const line of lines) {
        if (line.trim()) {
          const topic: Topic = {
            id: this.currentId++,
            text: line.trim(),
          };
          this.topics.set(topic.id, topic);
        }
      }
    } catch (error) {
      // File doesn't exist or is empty
      this.topics.clear();
      this.currentId = 1;
    }
  }

  private async saveToFile() {
    const lines = Array.from(this.topics.values())
      .map(topic => topic.text)
      .join("\n");
    
    await fs.writeFile(this.filePath, lines, "utf-8");
  }

  async getTopics(): Promise<Topic[]> {
    await this.loadFromFile(); // Reload to get latest data
    return Array.from(this.topics.values()).reverse(); // Show newest first
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const topic: Topic = {
      id: this.currentId++,
      text: insertTopic.text.trim(),
    };
    
    this.topics.set(topic.id, topic);
    await this.saveToFile();
    
    return topic;
  }

  async deleteTopic(id: number): Promise<boolean> {
    const deleted = this.topics.delete(id);
    if (deleted) {
      await this.saveToFile();
    }
    return deleted;
  }
}

export const storage = new FileStorage();
