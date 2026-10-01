const fs = require('fs');
let code = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GamePopupProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: 'alert' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  accent?: 'wrong' | 'consensus' | 'truth' | 'dare';
}

export function GamePopup({
  isOpen,
  title = 'Attention',
  message,
  type = 'alert',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  accent = 'dare'
}: GamePopupProps) {
  const accentClass = accent === 'wrong' ? 'border-accent-wrong-stroke text-accent-wrong-stroke bg-accent-wrong-stroke' : 
                      accent === 'consensus' ? 'border-accent-consensus-stroke text-accent-consensus-stroke bg-accent-consensus-stroke' : 
                      \`border-accent-\${accent} text-accent-\${accent} bg-accent-\${accent}\`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-primary/60 backdrop-blur-md"
            onClick={() => type === 'alert' ? onConfirm() : onCancel?.()}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-surface-card rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 text-center overflow-hidden border-4 border-ink-primary/20"
          >
            <h3 className="font-display font-black text-2xl uppercase tracking-widest text-ink-primary">{title}</h3>
            <p className="font-body text-ink-primary/80 font-medium text-lg leading-snug">
              {message}
            </p>
            <div className="mt-4 flex gap-3 w-full">
              {type === 'confirm' && (
                <button 
                  onClick={onCancel}
                  className="flex-1 py-4 bg-transparent border-4 border-ink-primary/20 text-ink-primary/60 font-display font-bold uppercase tracking-widest rounded-xl hover:bg-ink-primary/5 active:bg-ink-primary/10 transition-colors"
                >
                  {cancelText}
                </button>
              )}
              <button 
                onClick={onConfirm}
                className="flex-1 py-4 bg-ink-primary text-canvas font-display font-black uppercase tracking-widest rounded-xl shadow-solid-sm active:translate-y-1 active:shadow-none transition-all"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
`;
fs.writeFileSync('src/components/ui/GamePopup.tsx', code);
