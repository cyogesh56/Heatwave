const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

code = code.replace(
  /<div className="min-h-\[100dvh\] bg-canvas transition-colors duration-700 flex flex-col text-ink-primary relative overflow-hidden">/,
  `<div className="min-h-[100dvh] bg-canvas transition-colors duration-700 flex flex-col text-ink-primary relative overflow-hidden">
      <audio src="/saavane-sensual-music-390794.mp3" autoPlay loop muted={false} />`
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
