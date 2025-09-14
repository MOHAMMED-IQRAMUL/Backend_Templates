import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

// In-memory store
const items = new Map();

function paginate(array, page = 1, limit = 10) {
  const p = Math.max(1, Number.isFinite(page) ? page : 1);
  const l = Math.max(1, Math.min(100, Number.isFinite(limit) ? limit : 10));
  const start = (p - 1) * l;
  const end = start + l;
  return {
    page: p,
    limit: l,
    total: array.length,
    totalPages: Math.ceil(array.length / l) || 1,
    data: array.slice(start, end)
  };
}

export async function list({ page = 1, limit = 10, q } = {}) {
  let arr = Array.from(items.values());
  if (q) {
    const term = String(q).toLowerCase();
    arr = arr.filter(x =>
      x.name.toLowerCase().includes(term) ||
      (x.description && x.description.toLowerCase().includes(term))
    );
  }
  arr.sort((a, b) => b.createdAt - a.createdAt);
  return paginate(arr, page, limit);
}

export async function getById(id) {
  return items.get(String(id));
}

export async function create(data) {
  const now = new Date();
  const item = {
    id: nanoid(),
    name: data.name,
    description: data.description || '',
    createdAt: now,
    updatedAt: now
  };
  items.set(item.id, item);
  return item;
}

export async function update(id, data) {
  const existing = items.get(String(id));
  if (!existing) return null;
  const now = new Date();
  const updated = {
    ...existing,
    name: data.name,
    description: data.description || '',
    updatedAt: now
  };
  items.set(updated.id, updated);
  return updated;
}

export async function patch(id, data) {
  const existing = items.get(String(id));
  if (!existing) return null;
  const now = new Date();
  const patched = {
    ...existing,
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    updatedAt: now
  };
  items.set(patched.id, patched);
  return patched;
}

export async function remove(id) {
  return items.delete(String(id));
}
