const fs = require('fs');

let code = fs.readFileSync('src/lib/engine/stateMachine.ts', 'utf-8');

// We should inject a filter logic right after getting the initial availableCards array from allCards

const oldFilter = "availableCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));";

const newFilter = `availableCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));
        // Filter out cards that require more players than we have in the room
        availableCards = availableCards.filter(c => {
          const requiresC = c.prompt.includes('[Player C]') || (c.options && c.options.some(o => o.includes('[Player C]')));
          const requiresD = c.prompt.includes('[Player D]') || (c.options && c.options.some(o => o.includes('[Player D]')));
          if (requiresC && activePlayers.length < 3) return false;
          if (requiresD && activePlayers.length < 4) return false;
          return true;
        });`;

code = code.replace(oldFilter, newFilter); // Note: this replaces the first occurrence (in the while loop).
// Let's just use string replacement carefully.

// Wait, there are TWO places where `availableCards = this.allCards.filter` is used.
// 1. In isFinale block: `let finaleCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));`
// 2. In the while loop: `availableCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));`

code = code.replace(
  'let finaleCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));',
  `let finaleCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));
      finaleCards = finaleCards.filter(c => {
        const requiresC = c.prompt.includes('[Player C]') || (c.options && c.options.some(o => o.includes('[Player C]')));
        const requiresD = c.prompt.includes('[Player D]') || (c.options && c.options.some(o => o.includes('[Player D]')));
        if (requiresC && activePlayers.length < 3) return false;
        if (requiresD && activePlayers.length < 4) return false;
        return true;
      });`
);

code = code.replace(
  'availableCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));',
  `availableCards = this.allCards.filter(c => c.phase === searchPhase && !playedIds.includes(c.id));
        availableCards = availableCards.filter(c => {
          const requiresC = c.prompt.includes('[Player C]') || (c.options && c.options.some(o => o.includes('[Player C]')));
          const requiresD = c.prompt.includes('[Player D]') || (c.options && c.options.some(o => o.includes('[Player D]')));
          if (requiresC && activePlayers.length < 3) return false;
          if (requiresD && activePlayers.length < 4) return false;
          return true;
        });`
);

fs.writeFileSync('src/lib/engine/stateMachine.ts', code);
