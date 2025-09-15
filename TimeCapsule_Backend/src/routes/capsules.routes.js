import { Router } from 'express';
import * as ctrl from '../controllers/capsules.controller.js';
import { validateCreate, validateUnlock, validateMeta } from '../middlewares/validators.js';

const router = Router();

router.get('/', ctrl.listCapsules);
router.get('/:id', ctrl.getCapsule);
router.post('/', validateCreate, ctrl.createCapsule);
router.post('/:id/unlock', validateUnlock, ctrl.unlockCapsule);
router.patch('/:id/meta', validateMeta, ctrl.updateCapsuleMeta);
router.delete('/:id', ctrl.deleteCapsule);

export default router;
