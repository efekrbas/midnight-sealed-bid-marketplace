"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Star, Send, CheckCircle2, Heart } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

export default function FeedbackWidget() {
  const { notify } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"Feature Request" | "Bug Report" | "General">("General");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || rating === 0) return;
    
    setStatus("submitting");
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, rating, text }),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
          setText("");
          setRating(0);
        }, 2000);
      } else {
        setStatus("idle");
        notify("Submission Failed", "Failed to submit feedback. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-3.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center group ring-1 ring-white/20"
        title="Share Feedback"
      >
        <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
          <span className="pl-2 pr-1 font-bold text-xs">Feedback</span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            /* Doppelrand Outer Shell */
            className="fixed bottom-24 right-6 w-80 sm:w-96 p-1 rounded-[1.75rem] bg-white/[0.03] ring-1 ring-white/15 z-50 shadow-2xl overflow-hidden"
          >
            {/* Inner Core */}
            <div className="rounded-[calc(1.75rem-0.25rem)] bg-slate-900/95 border border-white/10 overflow-hidden">
              <div className="bg-slate-950/80 p-4 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-xs text-white uppercase font-mono tracking-wider">Share Feedback</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {status === "success" ? (
                  <div className="py-8 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-white text-base">Thank You!</p>
                    <p className="text-xs text-slate-400 mt-1">Your feedback was saved to the Midnight project repository.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
                      <div className="flex gap-2">
                        {(["General", "Feature Request", "Bug Report"] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                              type === t 
                                ? 'bg-purple-500/20 border-purple-500/40 text-purple-200 font-semibold' 
                                : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {t.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 block">Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none p-1 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`w-5 h-5 transition-colors ${
                                star <= (hoveredRating || rating) 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-slate-700'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <textarea 
                        required
                        placeholder="Tell us what you think or suggest improvements..."
                        className="w-full h-24 bg-slate-950 border border-white/15 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-white placeholder-slate-600 font-sans"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={status === "submitting" || !text || rating === 0}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg flex justify-center items-center space-x-2 disabled:opacity-50 transition-all"
                    >
                      {status === "submitting" ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Submit Feedback</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
