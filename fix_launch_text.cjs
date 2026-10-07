const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
code = code.replace(
  "{isHostless && !hostPlayerName.trim() ? 'Enter Name to Launch' : (chaosMode || chillMode ? 'Launch Custom Game' : 'Play Default Rules')}",
  "{chaosMode || chillMode ? 'Launch Custom Game' : 'Play Default Rules'}"
);
code = code.replace(
  "disabled={isHostless && !hostPlayerName.trim()}\n                className=\"w-full py-5 bg-ink-primary text-canvas disabled:opacity-50",
  "className=\"w-full py-5 bg-ink-primary text-canvas"
);
fs.writeFileSync('src/views/LobbyView.tsx', code);
