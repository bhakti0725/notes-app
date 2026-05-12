import { useState, useEffect } from 'react';

const NoteForm = ({ onSubmit, editNote, onCancel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // when editing, pre-fill the form
  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setBody(editNote.body);
    } else {
      setTitle('');
      setBody('');
    }
  }, [editNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        style={styles.input}
        placeholder="Note title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        style={styles.textarea}
        placeholder="Note body"
        value={body}
        onChange={e => setBody(e.target.value)}
        required
        rows={4}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={styles.button} type="submit">
          {editNote ? 'Update Note' : 'Add Note'}
        </button>
        {editNote && (
          <button style={styles.cancelBtn} type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const styles = {
  form: { background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' },
  input: { width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' },
  button: { padding: '8px 16px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
  cancelBtn: { padding: '8px 16px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }
};

export default NoteForm;