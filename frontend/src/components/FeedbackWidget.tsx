"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Star, Send, CheckCircle2 } from 'lucide-react';
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
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform z-50 flex items-center justify-center group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
          <span className="pl-2 pr-1 font-medium">Feedback</span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 right-6 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
            >
            <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
              <h3 className="font-semibold text-white">Send Feedback</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {status === "success" ? (
                <div className="py-8 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                  <p className="font-medium text-white">Thank you!</p>
                  <p className="text-sm text-gray-400 mt-1">Your feedback has been saved to FEEDBACK.md.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Feedback Type</label>
                    <div className="flex gap-2">
                      {(["Bug Report", "Feature Request", "General"] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                            type === t 
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {t.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Rate your experience</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-6 h-6 transition-colors ${
                              star <= (hoveredRating || rating) 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-gray-600'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea 
                      required
                      placeholder="Tell us what you think..."
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500/50 resize-none text-white"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === "submitting" || !text || rating === 0}
                    className="w-full glass-button py-2.5 rounded-lg flex justify-center items-center font-medium text-sm disabled:opacity-50"
                  >
                    {status === "submitting" ? "Submitting..." : (
                      <>Submit <Send className="w-4 h-4 ml-2" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
