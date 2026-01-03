import { useState, useEffect } from 'react';
import { Note } from '../types';
import { storage } from '../utils/storage';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    setNotes(storage.notes.get());
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    storage.notes.set(updatedNotes);
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const startEditing = () => {
    if (selectedNote) {
      setIsEditing(true);
    }
  };

  const saveNote = () => {
    if (!selectedNote) return;
    
    const updatedNote: Note = {
      ...selectedNote,
      title: editTitle || 'Untitled Note',
      content: editContent,
      updatedAt: Date.now(),
    };
    
    const updatedNotes = notes.map(note =>
      note.id === updatedNote.id ? updatedNote : note
    );
    
    saveNotes(updatedNotes);
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
    }
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-xl shadow-lg p-4 flex flex-col">
        <button
          onClick={createNote}
          className="flex items-center gap-2 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mb-4"
        >
          <Plus size={18} />
          New Note
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No notes yet</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedNote?.id === note.id
                    ? 'bg-primary-100 border-2 border-primary-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <h3 className="font-semibold text-gray-800 truncate">{note.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(note.updatedAt)}
                </p>
                {note.content && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {note.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col">
        {selectedNote ? (
          <>
            {isEditing ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-2xl font-bold text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Note title..."
                  />
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={saveNote}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder="Start writing your note..."
                />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedNote.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={startEditing}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteNote(selectedNote.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Created: {formatDate(selectedNote.createdAt)} | 
                  Updated: {formatDate(selectedNote.updatedAt)}
                </div>
                <div className="flex-1 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {selectedNote.content || <span className="text-gray-400">Empty note. Click edit to add content.</span>}
                  </pre>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No note selected</p>
              <p className="text-sm">Create a new note or select one from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

