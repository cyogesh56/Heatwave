const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  'const { card, parsedPrompt } = hostGameState.currentCard;',
  `if (!hostGameState.currentCard) {
    return <div className="min-h-[100dvh] bg-canvas text-ink-primary flex items-center justify-center font-display text-2xl md:text-3xl lg:text-4xl">Loading Deck...</div>;
  }

  const { card, parsedPrompt } = hostGameState.currentCard;`
);

fs.writeFileSync('src/views/HostView.tsx', code);
