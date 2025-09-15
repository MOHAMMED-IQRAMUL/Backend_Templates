export function validateCreate(req, res, next) {
  const { title, message, passphrase, unlockAt } = req.body || {};
  if (!title || typeof title !== 'string') return res.status(400).json({ message: 'title is required (string)' });
  if (!message || typeof message !== 'string') return res.status(400).json({ message: 'message is required (string)' });
  if (!passphrase || typeof passphrase !== 'string' || passphrase.length < 6) return res.status(400).json({ message: 'passphrase is required (min 6 chars)' });
  const when = Number(unlockAt);
  if (!Number.isFinite(when)) return res.status(400).json({ message: 'unlockAt must be epoch milliseconds' });
  if (when < Date.now()) return res.status(400).json({ message: 'unlockAt must be in the future' });
  next();
}

export function validateUnlock(req, res, next) {
  const { passphrase } = req.body || {};
  if (!passphrase || typeof passphrase !== 'string') return res.status(400).json({ message: 'passphrase is required' });
  next();
}

export function validateMeta(req, res, next) {
  if (typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ message: 'meta must be an object' });
  next();
}
