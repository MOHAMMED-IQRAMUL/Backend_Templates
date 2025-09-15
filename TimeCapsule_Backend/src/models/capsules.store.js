import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { customAlphabet } from 'nanoid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(dirname(__dirname));
const dataDir = join(projectRoot, 'data');
const dataFile = join(dataDir, 'capsules.json');
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

let memory = {
  capsules: []
};

let writeQueue = Promise.resolve();

async function ensureFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(memory, null, 2));
  }
}

async function load() {
  await ensureFile();
  const raw = await fs.readFile(dataFile, 'utf8');
  try {
    memory = JSON.parse(raw);
  } catch {
    memory = { capsules: [] };
  }
}

function persist() {
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(dataFile, JSON.stringify(memory, null, 2));
  }).catch(() => {});
  return writeQueue;
}

await load();

export function list({ page = 1, limit = 10, status } = {}) {
  let arr = memory.capsules.slice();
  if (status === 'locked') arr = arr.filter(c => Date.now() < c.unlockAt);
  if (status === 'unlocked') arr = arr.filter(c => Date.now() >= c.unlockAt);
  arr.sort((a, b) => a.unlockAt - b.unlockAt);
  const p = Math.max(1, page|0 || 1);
  const l = Math.max(1, Math.min(100, limit|0 || 10));
  const start = (p - 1) * l;
  const end = start + l;
  return {
    page: p,
    limit: l,
    total: arr.length,
    totalPages: Math.ceil(arr.length / l) || 1,
    data: arr.slice(start, end)
  };
}

export function get(id) {
  return memory.capsules.find(c => c.id === String(id));
}

export function create({ title, ciphertext, unlockAt, meta = {} }) {
  const now = Date.now();
  const capsule = {
    id: nanoid(),
    title,
    ciphertext,
    unlockAt, // epoch ms
    createdAt: now,
    updatedAt: now,
    meta
  };
  memory.capsules.push(capsule);
  persist();
  return capsule;
}

export function remove(id) {
  const idx = memory.capsules.findIndex(c => c.id === String(id));
  if (idx === -1) return false;
  memory.capsules.splice(idx, 1);
  persist();
  return true;
}

export function updateMeta(id, meta = {}) {
  const c = get(id);
  if (!c) return null;
  c.meta = { ...c.meta, ...meta };
  c.updatedAt = Date.now();
  persist();
  return c;
}
