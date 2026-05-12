import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  // fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data.data);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async ({ title, body }) => {
    try {
      const { data } = await api.post('/notes', { title, body });
      // add new note to top of list without refetching
      setNotes(prev => [data.data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create note');
    }
  };

  const handleUpdate = async ({ title, body }) => {
    try {
      const { data } = await api.patch(`/notes/${editNote._id}`, { title, body });
      // replace updated note in list
      setNotes(prev => prev.map(n => n._id === editNote._id ? data.data : n));
      setEditNote(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update note');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      // remove deleted note from list
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handleSubmit = (formData) => {
    if (editNote) {
      handleUpdate(formData);
    } else {
      handleCreate(formData);
    }
  };

  const handleImageUpload = async (noteId, file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post(`/notes/${noteId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setNotes(prev => prev.map(n => n._id === noteId ? data.data : n));
  } catch (err) {
    setError('Failed to upload image');
  }
};

  if (loading) return <div style={styles.center}>Loading notes...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>My Notes</h1>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <NoteForm
        onSubmit={handleSubmit}
        editNote={editNote}
        onCancel={() => setEditNote(null)}
      />

      {notes.length === 0 ? (
        <p style={{ color: '#9CA3AF', textAlign: 'center' }}>
          No notes yet. Create your first one above.
        </p>
      ) : (
        notes.map(note => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={handleDelete}
            onEdit={setEditNote}
            onImageUpload={handleImageUpload}
          />
        ))
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  logoutBtn: { padding: '8px 16px', background: 'transparent', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '14px', marginBottom: '12px' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }
};

export default Notes;