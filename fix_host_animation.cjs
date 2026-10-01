const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

if (!code.includes("import { motion, AnimatePresence } from 'framer-motion';")) {
    code = code.replace("import { PlayingCard } from '../components/ui/PlayingCard';", "import { PlayingCard } from '../components/ui/PlayingCard';\nimport { motion, AnimatePresence } from 'framer-motion';");
}

const cardBlock = `<div className="w-full max-w-md lg:max-w-xl aspect-[4/3] relative">
          <PlayingCard 
            prompt={parsedPrompt}
            type={card.type === 'kahoot' ? 'wrong' : card.type}
            index={hostGameState.phase}
          />`;

const newCardBlock = `<div className="w-full max-w-md lg:max-w-xl aspect-[4/3] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={card.id}
              initial={{ y: 200, opacity: 0, scale: 0.8, rotate: 3 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ y: -200, opacity: 0, scale: 0.8, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className="absolute inset-0"
            >
              <PlayingCard 
                prompt={parsedPrompt}
                type={card.type === 'kahoot' ? 'wrong' : card.type}
                index={hostGameState.phase}
              />
            </motion.div>
          </AnimatePresence>`;

code = code.replace(cardBlock, newCardBlock);

// For the fluid voting bars:
// In HostView, the style is currently: `style={{ width: \`\${percentage}%\` }}` with a CSS transition. That's already fluid (`transition-all duration-1000 ease-out`).
// We'll leave the voting bars as they are, CSS transitions are fine for pure width percentage.

// For the interstitial pulses:
const pulseRegex = /<div className="min-h-\[100dvh\] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-12 text-center transition-all animate-pulse">([\s\S]*?)<\/div>/;
const newPulse = `<motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-12 text-center"
      >
        $1
      </motion.div>`;
      
code = code.replace(pulseRegex, newPulse);

fs.writeFileSync('src/views/HostView.tsx', code);
