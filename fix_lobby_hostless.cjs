const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// Add hostPlayerName state
code = code.replace(
  "const [chillMode, setChillMode] = useState(false);",
  "const [chillMode, setChillMode] = useState(false);\n  const [hostPlayerName, setHostPlayerName] = useState('');\n  const isHostless = sessionStorage.getItem('hostlessMode') === 'true';"
);

// Add the input to the rules step
const rulesTarget = `<p className="font-body text-ink-primary/70 mb-6 sm:mb-8 font-medium">Customize the chaos, or just play vanilla.</p>`;
const rulesReplacement = `<p className="font-body text-ink-primary/70 mb-6 sm:mb-8 font-medium">Customize the chaos, or just play vanilla.</p>
            
            {isHostless && (
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-meta font-bold text-xs uppercase tracking-widest text-ink-primary/50">Your Display Name</label>
                <input 
                  type="text" 
                  maxLength={12}
                  value={hostPlayerName}
                  onChange={(e) => setHostPlayerName(e.target.value)}
                  placeholder="e.g. Maverick"
                  className="w-full bg-surface-card text-ink-primary text-xl font-body p-4 rounded-2xl border-4 border-ink-primary/10 focus:border-accent-consensus outline-none transition-colors shadow-solid-sm"
                />
              </div>
            )}`;
code = code.replace(rulesTarget, rulesReplacement);

// Update handleStart
const startTarget = `startGame(filteredCards);
    navigate('/host');`;
const startReplacement = `startGame(filteredCards);
    if (isHostless) {
      if (!hostPlayerName.trim()) { setPopupMessage("Please enter your name!"); return; }
      await initClient(hostServer?.roomCode || '', hostPlayerName);
      navigate('/play');
    } else {
      navigate('/host');
    }`;
code = code.replace(startTarget, startReplacement);

// Fix the disabled state of Launch button
code = code.replace(
  "{chaosMode || chillMode ? 'Launch Custom Game' : 'Play Default Rules'}",
  "{isHostless && !hostPlayerName.trim() ? 'Enter Name to Launch' : (chaosMode || chillMode ? 'Launch Custom Game' : 'Play Default Rules')}"
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
