const fs = require('fs');
let gm = fs.readFileSync('src/lib/engine/stateMachine.ts', 'utf8');

gm = gm.replace(
  "    return {\n      card: selectedCard,\n      parsedPrompt: parsed.text\n    };",
  "    return {\n      card: selectedCard,\n      parsedPrompt: parsed.text,\n      targetedPlayers: parsed.targetedPlayers\n    };"
);
gm = gm.replace(
  "public drawNextCard(activePlayers: string[], targetPhase?: number, targetType?: string): { card: Card, parsedPrompt: string } | null {",
  "public drawNextCard(activePlayers: string[], targetPhase?: number, targetType?: string): { card: Card, parsedPrompt: string, targetedPlayers?: string[] } | null {"
);
fs.writeFileSync('src/lib/engine/stateMachine.ts', gm);
console.log('GameEngine fixed');
