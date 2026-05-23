// src/components/NoteEditor.jsx

import { useState } from "react";
import useNotes from "../hooks/useNotes";
import { useToast } from "../context/ToastContext";

const NoteEditor = ({ movieId }) => {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes(movieId);
  const { showToast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Add note ─────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      await addNote(newNote.trim());
      showToast("Note saved!");
      setNewNote("");
    } finally {
      setSaving(false);
    }
  };

  // ── Start editing ────────────────────────────────────────────
  const handleEditStart = (note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  // ── Save edit ────────────────────────────────────────────────
  const handleEditSave = async (noteId) => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await updateNote(noteId, editContent.trim());
      showToast("Note updated!");
      setEditingId(null);
      setEditContent("");
    } finally {
      setSaving(false);
    }
  };

  // ── Cancel edit ──────────────────────────────────────────────
  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  // ── Delete note ──────────────────────────────────────────────
  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(noteId);
    showToast("Note deleted.", "info");
  };

  // ── Format timestamp ─────────────────────────────────────────
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📝 Notes</h3>

      {/* New note input */}
      <div style={styles.inputWrapper}>
        <textarea
          style={styles.textarea}
          placeholder="Write a note about this movie..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        />
        <button
          style={{
            ...styles.addBtn,
            opacity: saving || !newNote.trim() ? 0.6 : 1,
          }}
          onClick={handleAdd}
          disabled={saving || !newNote.trim()}
        >
          {saving ? "Saving..." : "Add note"}
        </button>
      </div>

      {/* Notes list */}
      {loading ? (
        <p style={styles.empty}>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p style={styles.empty}>No notes yet. Add one above!</p>
      ) : (
        <div style={styles.notesList}>
          {notes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              {editingId === note.id ? (
                // Edit mode
                <div style={styles.editWrapper}>
                  <textarea
                    style={styles.textarea}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                  />
                  <div style={styles.editActions}>
                    <button
                      style={styles.saveEditBtn}
                      onClick={() => handleEditSave(note.id)}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button style={styles.cancelBtn} onClick={handleEditCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <p style={styles.noteContent}>{note.content}</p>
                  <div style={styles.noteMeta}>
                    <span style={styles.noteDate}>
                      {formatDate(note.updatedAt || note.createdAt)}
                    </span>
                    <div style={styles.noteActions}>
                      <button
                        style={styles.editBtn}
                        onClick={() => handleEditStart(note)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "32px",
  },
  heading: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "24px",
  },
  textarea: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    lineHeight: "1.5",
    fontFamily: "inherit",
  },
  addBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  empty: {
    color: "#555",
    fontSize: "14px",
    textAlign: "center",
    padding: "24px 0",
  },
  notesList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  noteCard: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  noteContent: {
    color: "#ccc",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0 0 10px",
    whiteSpace: "pre-wrap",
  },
  noteMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteDate: {
    color: "#555",
    fontSize: "12px",
  },
  noteActions: {
    display: "flex",
    gap: "8px",
  },
  editBtn: {
    backgroundColor: "transparent",
    border: "1px solid #333",
    color: "#888",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "transparent",
    border: "1px solid #3a2020",
    color: "#ff6b6b",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    cursor: "pointer",
  },
  editWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  editActions: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  },
  saveEditBtn: {
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    border: "1px solid #333",
    color: "#888",
    borderRadius: "6px",
    padding: "6px 14px",
    fontSize: "13px",
    cursor: "pointer",
  },
};

export default NoteEditor;
