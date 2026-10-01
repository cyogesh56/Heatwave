const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf-8');

// The file was already updated to import motion by the previous run, but the block didn't replace.
// Let's check if 'motion' is imported.
if (!code.includes("import { motion")) {
    code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';");
}

const start = code.indexOf("if (step === 'hero') {");
const end = code.indexOf("if (step === 'setup') {");
const oldHero = code.substring(start, end);

const newHero = `if (step === 'hero') {
    return (
      <div className="min-h-[100dvh] bg-canvas flex flex-col items-center justify-center p-6 text-ink-primary relative overflow-hidden">
        <div className="text-center z-10 flex flex-col items-center relative">
          <motion.div 
            initial={{ scale: 200 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25, bounce: 0, duration: 0.2 }}
            className="w-20 h-20 bg-accent-truth/10 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-50"
          >
            <div className="absolute inset-0 bg-accent-truth blur-xl opacity-20 rounded-full"></div>
            <IconFlame className="w-10 h-10 text-accent-truth relative z-10" fill="currentColor" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-6xl sm:text-8xl font-display font-black mb-4 tracking-tighter uppercase"
          >
            Handsy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="text-xl sm:text-2xl font-body text-ink-primary/70 mb-8 sm:mb-12 max-w-sm mx-auto font-medium"
          >
            The party game for people who hate party games.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring' }}
            onClick={() => setStep('setup')}
            className="mt-6 sm:mt-8 w-full max-w-[280px] sm:max-w-sm py-4 sm:py-5 bg-accent-truth text-canvas font-display font-bold text-lg sm:text-2xl uppercase tracking-widest rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            Enter the Fire
          </motion.button>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            onClick={() => setShowHelp(true)}
            className="mt-4 font-meta text-sm font-bold uppercase tracking-widest text-ink-primary/50 hover:text-ink-primary transition-colors underline decoration-2 underline-offset-4"
          >
            How to Play?
          </motion.button>
        </div>

        {/* HOW TO PLAY SHEET */}
        <div className={\`absolute bottom-0 left-0 w-full max-h-[85vh] overflow-y-auto bg-surface-card rounded-t-[2rem] border-t-4 border-ink-primary shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 p-6 sm:p-10 flex flex-col gap-8 \${showHelp ? 'translate-y-0' : 'translate-y-[120%]'}\`}>
          <div className="w-16 h-1.5 bg-ink-primary/20 rounded-full mx-auto shrink-0 -mt-2" />
          
          <div className="flex justify-between items-center">
             <h3 className="font-display font-black uppercase tracking-widest text-3xl text-ink-primary">How to Play</h3>
             <button onClick={() => setShowHelp(false)} className="w-10 h-10 bg-ink-primary/5 rounded-full flex items-center justify-center font-display font-black text-xl text-ink-primary/50 hover:bg-ink-primary/10 transition-colors">✕</button>
          </div>
          
          <div className="flex flex-col gap-8 text-left pb-12">
             <div className="flex flex-col gap-2">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-truth">1. The Setup</h4>
                <p className="font-body text-ink-primary/80 leading-relaxed font-medium">Handsy is a couch-party game. One person hosts the room on a big screen (TV, Laptop, or Tablet). Everyone else joins on their phones to use as controllers. The TV is the center of attention.</p>
             </div>
             
             <div className="flex flex-col gap-2">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-consensus">2. Power Drops</h4>
                <p className="font-body text-ink-primary/80 leading-relaxed font-medium">Every time a new card is drawn, there is a random chance for a hidden Power to drop. Keep an eye out for loot popups on your phone!</p>
             </div>
             
             <div className="flex flex-col gap-4">
                <h4 className="font-display font-bold text-xl uppercase tracking-widest text-accent-dare">3. Using Powers</h4>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🔄 DEFLECT</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Pass the heat to someone else! Replaces the target of a dare or physical challenge with another player of your choice.</p>
                </div>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🛑 KILLSWITCH</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Not feeling the vibe? Nuke the current card immediately and force the game to draw a random replacement.</p>
                </div>
                
                <div className="bg-canvas border-2 border-ink-primary/10 rounded-2xl p-5 flex flex-col gap-1">
                   <h5 className="font-display font-black text-lg text-ink-primary">🔥 OVERRIDE</h5>
                   <p className="font-body text-ink-primary/70 text-sm font-medium">Take control of the room. Force the game into a completely new Phase (Spark, Deepen, Ignite, or Melt) instantly.</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    );
  }

  `;

code = code.replace(oldHero, newHero);
fs.writeFileSync('src/views/Landing.tsx', code);
