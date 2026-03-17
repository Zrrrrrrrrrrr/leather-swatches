import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

// 确保数据目录存在
async function ensureDb() {
  const dir = path.dirname(dbPath);
  await fs.mkdir(dir, { recursive: true });
  
  try {
    await fs.access(dbPath);
  } catch {
    // 文件不存在，创建初始结构
    const initialData = {
      materials: [],
      swatches: [],
      productImages: [],
      merchants: []
    };
    await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function writeDb(data: any) {
  await ensureDb();
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export { readDb, writeDb, dbPath };
