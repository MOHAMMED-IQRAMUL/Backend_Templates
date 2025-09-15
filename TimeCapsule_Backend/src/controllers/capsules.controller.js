import * as store from '../models/capsules.store.js';
import { encrypt, decrypt } from '../utils/crypto.js';

export async function listCapsules(req, res, next) {
  try {
    const { page = '1', limit = '10', status } = req.query;
    const result = store.list({ page: Number(page), limit: Number(limit), status });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createCapsule(req, res, next) {
  try {
    const { title, message, passphrase, unlockAt, meta } = req.body || {};
    const unlockMs = Number(unlockAt);
    const ciphertext = encrypt(message, passphrase);
    const created = store.create({ title, ciphertext, unlockAt: unlockMs, meta });
    res.status(201).json({ id: created.id, title: created.title, unlockAt: created.unlockAt, createdAt: created.createdAt, meta: created.meta });
  } catch (e) { next(e); }
}

export async function getCapsule(req, res, next) {
  try {
    const c = store.get(req.params.id);
    if (!c) return res.status(404).json({ message: 'Capsule not found' });
    res.json({ id: c.id, title: c.title, unlockAt: c.unlockAt, createdAt: c.createdAt, updatedAt: c.updatedAt, meta: c.meta, status: Date.now() >= c.unlockAt ? 'unlocked' : 'locked' });
  } catch (e) { next(e); }
}

export async function deleteCapsule(req, res, next) {
  try {
    const ok = store.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Capsule not found' });
    res.status(204).send();
  } catch (e) { next(e); }
}

export async function unlockCapsule(req, res, next) {
  try {
    const c = store.get(req.params.id);
    if (!c) return res.status(404).json({ message: 'Capsule not found' });
    if (Date.now() < c.unlockAt) return res.status(423).json({ message: 'Capsule is still locked', unlockAt: c.unlockAt });
    const { passphrase } = req.body || {};
    try {
      const message = decrypt(c.ciphertext, passphrase);
      res.json({ id: c.id, title: c.title, message, unlockedAt: Date.now(), meta: c.meta });
    } catch {
      res.status(401).json({ message: 'Invalid passphrase' });
    }
  } catch (e) { next(e); }
}

export async function updateCapsuleMeta(req, res, next) {
  try {
    const updated = store.updateMeta(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ message: 'Capsule not found' });
    res.json({ id: updated.id, title: updated.title, unlockAt: updated.unlockAt, meta: updated.meta, updatedAt: updated.updatedAt });
  } catch (e) { next(e); }
}
