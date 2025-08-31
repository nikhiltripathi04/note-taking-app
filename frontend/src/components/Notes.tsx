import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
}

interface Note {
  _id: string;
  content: string;
  user: string;
  createdAt: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setUser({ id: decoded.id, email: decoded.email });
      fetchNotes(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      navigate('/login');
    }
  }, [navigate, token]);

  const fetchNotes = async (authToken: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const response = await axios.get('http://localhost:5000/api/notes', config);
      setNotes(response.data);
    } catch (error: any) {
      console.error('Failed to fetch notes:', error.response?.data?.message || error.message);
      navigate('/login');
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !token) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(
        'http://localhost:5000/api/notes',
        { content: newNote },
        config
      );
      setNotes([...notes, response.data]);
      setNewNote('');
    } catch (error: any) {
      console.error('Failed to create note:', error.response?.data?.message || error.message);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!token) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/notes/${id}`, config);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error: any) {
      console.error('Failed to delete note:', error.response?.data?.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Layout>
      <div className="notes-dashboard">
        <div className="dashboard-header">
          <h2>Welcome, {user?.email}!</h2>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        
        <div className="notes-container">
          <form onSubmit={handleCreateNote} className="note-form">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
              rows={4}
              className="note-textarea"
            ></textarea>
            <button type="submit" className="add-note-button">Add Note</button>
          </form>
          
          <div className="notes-list">
            <h3>Your Notes</h3>
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} className="note-item">
                  <p>{note.content}</p>
                  <button onClick={() => handleDeleteNote(note._id)} className="delete-note-button">Delete</button>
                </div>
              ))
            ) : (
              <p className="no-notes-message">You have no notes yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notes;