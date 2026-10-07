const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

// Remove all instances of the old check
code = code.replace(/  if \(!hostGameState\?\.currentCard\) \{\n\n    return <div className="min-h-\[100dvh\] bg-canvas text-ink-primary flex items-center justify-center font-display text-2xl md:text-3xl lg:text-4xl">Loading Deck\.\.\.<\/div>;\n  \}/g, '');
code = code.replace(/  if \(!hostGameState\.currentCard\) \{\n    return <div className="min-h-\[100dvh\] bg-canvas text-ink-primary flex items-center justify-center font-display text-2xl md:text-3xl lg:text-4xl">Loading Deck\.\.\.<\/div>;\n  \}/g, '');

// Insert the master check at the very beginning of the return block, before ANY other returns
code = code.replace(
  "  const connectedPlayers = Object.values(hostGameState.players).filter((p: any) => p.isConnected !== false);",
  `  if (!hostGameState || !hostGameState.currentCard) {
    return <div className="min-h-[100dvh] bg-canvas text-ink-primary flex items-center justify-center font-display text-2xl md:text-3xl lg:text-4xl">Loading Deck...</div>;
  }

  const connectedPlayers = Object.values(hostGameState.players).filter((p: any) => p.isConnected !== false);`
);

fs.writeFileSync('src/views/HostView.tsx', code);
