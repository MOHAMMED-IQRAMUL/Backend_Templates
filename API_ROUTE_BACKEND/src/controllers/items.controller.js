import * as itemsModel from '../models/items.model.js';

export async function listItems(req, res, next) {
  try {
    const { page = '1', limit = '10', q } = req.query;
    const result = await itemsModel.list({ page: Number(page), limit: Number(limit), q });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getItemById(req, res, next) {
  try {
    const item = await itemsModel.getById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const item = await itemsModel.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const updated = await itemsModel.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function patchItem(req, res, next) {
  try {
    const patched = await itemsModel.patch(req.params.id, req.body);
    if (!patched) return res.status(404).json({ message: 'Item not found' });
    res.json(patched);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const ok = await itemsModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Item not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
