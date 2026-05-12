const NoteCard = ({ note, onDelete, onEdit, onImageUpload }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) onImageUpload(note._id, file);
  };

  return (
    <div style={styles.card}>
      {note.imageUrl && (
        <img
          src={note.imageUrl}
          alt={note.title}
          style={styles.image}
        />
      )}
      <div style={styles.header}>
        <h3 style={styles.title}>{note.title}</h3>
        <div style={styles.actions}>
          <label style={styles.uploadBtn}>
            {note.imageUrl ? 'Change Image' : 'Add Image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
          <button style={styles.editBtn} onClick={() => onEdit(note)}>Edit</button>
          <button style={styles.deleteBtn} onClick={() => onDelete(note._id)}>Delete</button>
        </div>
      </div>
      <p style={styles.body}>{note.body}</p>
      <p style={styles.date}>{new Date(note.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

const styles = {
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '12px', overflow: 'hidden' },
  image: { width: '100%', maxHeight: '200px', objectFit: 'cover' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', paddingBottom: '8px' },
  title: { margin: 0, fontSize: '16px', fontWeight: '600' },
  actions: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  uploadBtn: { padding: '4px 10px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  editBtn: { padding: '4px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { padding: '4px 10px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  body: { color: '#6B7280', fontSize: '14px', margin: '0', padding: '0 1rem 8px' },
  date: { color: '#9CA3AF', fontSize: '12px', margin: 0, padding: '0 1rem 1rem' }
};

export default NoteCard;