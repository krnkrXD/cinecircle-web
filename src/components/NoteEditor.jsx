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

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      await addNote(newNote.trim());
      setNewNote("");
      showToast("Note saved!");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (noteId) => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await updateNote(noteId, editContent.trim());
      setEditingId(null);
      showToast("Note updated!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(noteId);
    showToast("Note deleted.", "info");
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    return ts
      .toDate()
      .toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  };

  return (
    <div>
      <div style={s.heading}>
        <div style={s.headingLine} />
        <h3 style={s.headingText}>Field notes</h3>
      </div>

      {/* Input */}
      <div style={s.inputWrap}>
        <textarea
          style={s.textarea}
          placeholder="Write a note about this film..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        />
        <button
          style={{ ...s.addBtn, opacity: saving || !newNote.trim() ? 0.6 : 1 }}
          onClick={handleAdd}
          disabled={saving || !newNote.trim()}
        >
          {saving ? "Saving..." : "Add note →"}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p style={s.empty}>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p style={s.empty}>No notes yet.</p>
      ) : (
        <div style={s.list}>
          {notes.map((note) => (
            <div key={note.id} style={s.noteCard}>
              {editingId === note.id ? (
                <div style={s.editWrap}>
                  <textarea
                    style={s.textarea}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                  />
                  <div style={s.editActions}>
                    <button
                      style={s.saveEditBtn}
                      onClick={() => handleEditSave(note.id)}
                      disabled={saving}
                    >
                      {saving ? "..." : "Save"}
                    </button>
                    <button
                      style={s.cancelBtn}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={s.noteText}>{note.content}</p>
                  <div style={s.noteMeta}>
                    <span style={s.noteDate}>
                      {formatDate(note.updatedAt || note.createdAt)}
                    </span>
                    <div style={s.noteActions}>
                      <button
                        style={s.editBtn}
                        onClick={() => {
                          setEditingId(note.id);
                          setEditContent(note.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={s.deleteBtn}
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

const s = {
  heading: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  headingLine: { width: "24px", height: "3px", background: "#C41E1E" },
  headingText: {
    fontFamily: "'Playfair Display',serif",
    fontSize: "20px",
    fontWeight: 900,
    color: "#1A1A1A",
  },
  inputWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },
  textarea: {
    background: "#F5F0E8",
    border: "2px solid #1A1A1A",
    padding: "10px 12px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#1A1A1A",
    outline: "none",
    resize: "vertical",
    lineHeight: 1.6,
    width: "100%",
    boxSizing: "border-box",
  },
  addBtn: {
    alignSelf: "flex-end",
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    boxShadow: "2px 2px 0 #8B7355",
    padding: "8px 18px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  empty: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "12px",
    color: "#8B7355",
    padding: "16px 0",
  },
  list: { display: "flex", flexDirection: "column", gap: "0" },
  noteCard: {
    border: "2px solid #1A1A1A",
    borderBottom: "none",
    padding: "14px",
    background: "#F5F0E8",
  },
  noteText: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "13px",
    color: "#1A1A1A",
    lineHeight: 1.7,
    marginBottom: "10px",
    whiteSpace: "pre-wrap",
  },
  noteMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteDate: {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    color: "#8B7355",
  },
  noteActions: { display: "flex", gap: "6px" },
  editBtn: {
    background: "transparent",
    border: "1.5px solid #1A1A1A",
    color: "#1A1A1A",
    padding: "3px 10px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "transparent",
    border: "1.5px solid #C41E1E",
    color: "#C41E1E",
    padding: "3px 10px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  editWrap: { display: "flex", flexDirection: "column", gap: "8px" },
  editActions: { display: "flex", gap: "6px", justifyContent: "flex-end" },
  saveEditBtn: {
    background: "#1A1A1A",
    color: "#F5F0E8",
    border: "2px solid #1A1A1A",
    padding: "6px 14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "transparent",
    border: "1.5px solid #1A1A1A",
    color: "#1A1A1A",
    padding: "6px 14px",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: "10px",
    textTransform: "uppercase",
    cursor: "pointer",
  },
};

export default NoteEditor;
