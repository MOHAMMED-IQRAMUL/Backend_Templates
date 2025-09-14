import { Router } from 'express';
import * as itemsController from '../controllers/items.controller.js';
import { validateCreateItem, validateUpdateItem, validatePatchItem } from '../middlewares/validators.js';

const router = Router();

router.get('/', itemsController.listItems);
router.get('/:id', itemsController.getItemById);
router.post('/', validateCreateItem, itemsController.createItem);
router.put('/:id', validateUpdateItem, itemsController.updateItem);
router.patch('/:id', validatePatchItem, itemsController.patchItem);
router.delete('/:id', itemsController.deleteItem);

export default router;
