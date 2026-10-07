const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');
code = code.replace(
  "className=\"w-full py-5 bg-ink-primary text-canvas",
  "disabled={isHostless && !hostPlayerName.trim()}\n                className=\"w-full py-5 bg-ink-primary text-canvas disabled:opacity-50"
);
fs.writeFileSync('src/views/LobbyView.tsx', code);
