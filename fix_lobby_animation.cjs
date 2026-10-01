const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

if (!code.includes("import { motion, AnimatePresence } from 'framer-motion';")) {
    code = code.replace("import { IconZap } from '../components/icons';", "import { IconZap } from '../components/icons';\nimport { motion, AnimatePresence } from 'framer-motion';");
}

const pillBlock = `              connectedPlayers.map((p, i) => (
                <div key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-surface-card rounded-full shadow-solid-sm border-2 border-ink-primary/20 font-bold font-body text-sm sm:text-base">
                  {p.name}
                </div>
              ))`;
              
const newPillBlock = `              <AnimatePresence>
                {connectedPlayers.map((p, i) => (
                  <motion.div 
                    key={p.name} // using name as key instead of index for stable animations
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-surface-card rounded-full shadow-solid-sm border-2 border-ink-primary/20 font-bold font-body text-sm sm:text-base"
                  >
                    {p.name}
                  </motion.div>
                ))}
              </AnimatePresence>`;

code = code.replace(pillBlock, newPillBlock);

fs.writeFileSync('src/views/LobbyView.tsx', code);
