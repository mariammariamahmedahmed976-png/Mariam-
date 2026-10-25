import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  X,
  Zap,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface TributeChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TributeChatbot: React.FC<TributeChatbotProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content:
        'Peace and greetings! I am your Tribute & Dedication Companion, here to help you honor Eng. Mohamed Anwar. How can I assist you today? I can help write custom appreciation poems, draft an inspiring speech, or compose a unique thank-you note.',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelChoice, setModelChoice] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>(
    'gemini-3.8-flash'
  );
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Write an inspiring tribute poem for Eng. Mohamed Anwar',
    'Draft an emotional speech thanking my mentor',
    'What are memorable quotes celebrating great teachers?',
    'Write a heartfelt thank-you card for his patience and guidance',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to server
      const payload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payload,
          modelChoice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      const botMsg: ChatMessage = {
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: 'model',
        content: `Error: ${err.message || 'Could not connect to Gemini service.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tribute-companion-title"
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? 'bottom-6 right-6 w-80'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[460px] max-h-[85vh]'
      }`}
    >
      <div className="bg-slate-900 border border-blue-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col glow-blue text-white">
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-blue-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/25 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 id="tribute-companion-title" className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Tribute & Gratitude Companion</span>
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              </h4>
              <p className="text-[11px] text-sky-300/80">
                Honoring Mr. Mohamed Anwar with Gemini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close companion"
              aria-label="Close companion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Model Selector Bar */}
            <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-sky-400" />
                <span>Engine:</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setModelChoice('gemini-3.8-flash')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    modelChoice === 'gemini-3.8-flash'
                      ? 'bg-blue-600 text-white shadow-sm glow-blue'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3.8 Flash (General)
                </button>
                <button
                  onClick={() => setModelChoice('gemini-3.1-flash-lite')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    modelChoice === 'gemini-3.1-flash-lite'
                      ? 'bg-blue-600 text-white shadow-sm glow-blue'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3.1 Lite (Fast)
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="p-4 overflow-y-auto space-y-3.5 h-[340px] bg-slate-950/70">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'model' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white shadow-md rounded-br-none glow-blue'
                        : 'bg-slate-900/90 border border-blue-900/40 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        m.role === 'user' ? 'text-blue-200' : 'text-slate-500'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>

                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-sky-400 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-slate-900/90 border border-blue-900/40 rounded-2xl rounded-bl-none flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    <span>Composing tribute thought...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts */}
            <div className="p-2.5 bg-slate-950 border-t border-slate-900 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  className="whitespace-nowrap shrink-0 text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-300 rounded-lg border border-slate-800 transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-950 border-t border-blue-900/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask to write a poem, letter, or speech..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md glow-blue transition-all"
                title="Send message"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
