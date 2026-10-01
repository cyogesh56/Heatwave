const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /        \}, 4000 \+ delayMs\);\n      \}\n    \}\n  \};\n\n  if \(!hostGameState\?\.currentCard\)/,
  `        }, 4000 + delayMs);\n      }\n    } else {\n      // Deck is empty, trigger game over\n      setHostGameState(prev => {\n        if (!prev) return null;\n        const next = { ...prev, uiState: 'ended' as const };\n        hostServer?.broadcast(next);\n        return next;\n      });\n    }\n  };\n\n  if (!hostGameState?.currentCard)`
);

fs.writeFileSync('src/views/HostView.tsx', code);
