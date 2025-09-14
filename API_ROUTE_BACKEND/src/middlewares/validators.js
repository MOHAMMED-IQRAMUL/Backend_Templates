export function validateCreateItem(req, res, next) {
  const { name, description } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return res.status(400).json({ message: 'Field "name" is required and must be a non-empty string.' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ message: 'Field "description" must be a string if provided.' });
  }
  next();
}

export function validateUpdateItem(req, res, next) {
  const { name, description } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return res.status(400).json({ message: 'Field "name" is required and must be a non-empty string.' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ message: 'Field "description" must be a string if provided.' });
  }
  next();
}

export function validatePatchItem(req, res, next) {
  const { name, description } = req.body || {};
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 1)) {
    return res.status(400).json({ message: 'If provided, field "name" must be a non-empty string.' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ message: 'If provided, field "description" must be a string.' });
  }
  next();
}
