import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, Send, Sparkles, Heart } from 'lucide-react';

interface Note {
  id: string;
  author: string;
  role: string;
  message: string;
  date: string;
  likes: number;
}

const DEFAULT_NOTES: Note[] = [
  {
    id: '1',
    author: 'Eng.Mariam Bahei El Din 👩🏻‍💻❤️',
    role: 'Grateful Student & Engineer',
    message:
      'Eng. Mohamed Anwar, thank you for being the extraordinary mentor who always turned complex engineering and science concepts into pure clarity. Your patience, your brilliant guidance, and your faith in me have shaped my path and inspired my future. I am forever grateful for your mentorship!',
    date: 'October 2026',
    likes: 24,
  },
];

export const GuestbookWall: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(DEFAULT_NOTES);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('tribute_guestbook_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    const newNote: Note = {
      id: Date.now().toString(),
      author: newAuthor.trim(),
      role: newRole.trim() || 'Student & Well-Wisher',
      message: newMessage.trim(),
      date: 'Just now',
      likes: 1,
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    try {
      localStorage.setItem('tribute_guestbook_notes', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    setNewAuthor('');
    setNewRole('');
    setNewMessage('');
    setIsSubmitting(false);
  };

  const handleLike = (id: string) => {
    if (hasLiked[id]) return;
    setHasLiked((prev) => ({ ...prev, [id]: true }));
    const updated = notes.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n));
    setNotes(updated);
    try {
      localStorage.setItem('tribute_guestbook_notes', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Wall Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-widest">
            <MessageSquareHeart className="w-4 h-4" />
            <span>Appreciation Wall</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Student Gratitude & Keepsake Notes
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Leave a personal memory or tribute honoring Eng. Mohamed Anwar
          </p>
        </div>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-2xl bg-slate-900/80 border border-blue-900/40 p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all glow-blue"
          >
            <div>
              {/* Unboxed metadata adhering to zero-pill discipline */}
              <div className="flex items-center gap-2 text-xs text-sky-400/90 font-medium mb-3">
                <span className="text-white font-semibold inline-flex items-center gap-1.5 transition-transform hover:scale-110 hover:-translate-y-1 hover:animate-bounce cursor-pointer glow-text-cyan">
                  {note.author}
                </span>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span className="text-slate-400">{note.role}</span>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span className="text-slate-500">{note.date}</span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-light">
                "{note.message}"
              </p>
            </div>

            {/* Bottom action */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>To Eng. Mohamed Anwar</span>
              </span>

              <button
                onClick={() => handleLike(note.id)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all ${
                  hasLiked[note.id]
                    ? 'text-sky-300 bg-sky-950/60'
                    : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800/60'
                }`}
                title="Send heart appreciation"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    hasLiked[note.id] ? 'fill-sky-400 text-sky-400' : ''
                  }`}
                />
                <span className="font-mono tabular-nums">{note.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Gratitude Note Form */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-blue-500/30 p-6 sm:p-8 backdrop-blur-md">
        <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Add Your Words of Thanks</span>
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Your message will be preserved in this appreciation wall dedicated to Eng. Mohamed Anwar.
        </p>

        <form onSubmit={handleAddNote} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g. Eng.Mariam Bahei El Din 👩🏻‍💻❤️"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Role or Note (Optional)
              </label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Grateful Student"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Your Thank-You Message *
            </label>
            <textarea
              required
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Express your sincere gratitude, a memorable lesson, or a wish for Eng. Mohamed Anwar..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm rounded-xl transition-all shadow-md glow-blue flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Post Appreciation Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
