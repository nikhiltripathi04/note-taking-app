import { Request, Response } from 'express';
import Note from '../models/note';

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req: Request, res: Response) => {
  const { content } = req.body;
  const user = req.user._id;

  if (!content) {
    return res.status(400).json({ message: 'Please add a content field' });
  }

  try {
    const note = await Note.create({ user, content });
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure the logged-in user owns the note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this note' });
    }

    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's notes
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req: Request, res: Response) => {
    try {
        const notes = await Note.find({ user: req.user._id });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};