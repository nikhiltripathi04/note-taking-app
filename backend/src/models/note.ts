import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const NoteSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model<INote>('Note', NoteSchema);

export default Note;