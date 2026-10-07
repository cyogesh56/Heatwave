const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

// 1. Add isJoining state
code = code.replace(
  "const [hostPlayerName, setHostPlayerName] = useState('');",
  "const [hostPlayerName, setHostPlayerName] = useState('');\n  const [isJoining, setIsJoining] = useState(false);"
);

// 2. Fix toggle dot visibility
// In the Vanilla toggle
code = code.replace(
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'",
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'"
);
// In the Chaos toggle
code = code.replace(
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'",
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'"
);
// In the Chill toggle
code = code.replace(
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary/40'",
  "'translate-x-6 bg-surface-card' : 'translate-x-0 bg-ink-primary'"
);

// 3. Fix the "Join" button to show loading and lock input
code = code.replace(
  "className=\"w-full bg-canvas text-ink-primary text-center text-xl font-body p-3 rounded-xl border-2 border-ink-primary/10 focus:border-accent-dare outline-none transition-colors\"",
  "disabled={isJoining}\n                      className=\"w-full bg-canvas text-ink-primary text-center text-xl font-body p-3 rounded-xl border-2 border-ink-primary/10 focus:border-accent-dare outline-none transition-colors disabled:opacity-50\""
);

code = code.replace(
  "onClick={() => initClient(hostServer?.roomCode || '', hostPlayerName)}\n                      disabled={!hostPlayerName.trim()}\n                      className=\"w-full mt-2 py-3 bg-accent-dare text-canvas font-display font-bold text-lg uppercase tracking-widest rounded-xl disabled:opacity-50 active:scale-95 transition-all\"\n                    >\n                      Join\n                    </button>",
  "onClick={async () => {\n                        setIsJoining(true);\n                        await initClient(hostServer?.roomCode || '', hostPlayerName);\n                        setIsJoining(false);\n                      }}\n                      disabled={!hostPlayerName.trim() || isJoining}\n                      className=\"w-full mt-2 py-3 bg-accent-dare text-canvas font-display font-bold text-lg uppercase tracking-widest rounded-xl disabled:opacity-50 active:scale-95 transition-all\"\n                    >\n                      {isJoining ? 'Joining...' : 'Join'}\n                    </button>"
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
