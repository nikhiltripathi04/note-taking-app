import { Router } from 'express';
import { createNote, deleteNote, getNotes } from '../controllers/noteController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// The 'protect' middleware ensures only authenticated users can access these routes
router.route('/').post(protect, createNote).get(protect, getNotes);
router.route('/:id').delete(protect, deleteNote);

export default router;