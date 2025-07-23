import fs from 'fs/promises';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const filePath = '/tmp/topics.txt';
      
      let fileContent = 'Arquivo não existe';
      try {
        fileContent = await fs.readFile(filePath, "utf-8");
      } catch (error) {
        fileContent = 'Erro ao ler arquivo: ' + error.message;
      }

      const debug = {
        timestamp: new Date().toISOString(),
        filePath: filePath,
        fileExists: await fs.access(filePath).then(() => true).catch(() => false),
        fileContent: fileContent,
        fileLines: fileContent ? fileContent.split('\n') : [],
        query: req.query,
        url: req.url
      };

      return res.status(200).json(debug);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}