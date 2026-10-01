const fs = require('fs');
let gc = fs.readFileSync('src/context/GameContext.tsx', 'utf8');

gc = gc.replace(
  "            if (prev.uiState !== 'waiting') {\n              setTimeout(() => {\n                server.broadcast(nextState);\n              }, 300);\n            }",
  "            setTimeout(() => {\n              server.broadcast(nextState);\n            }, 300);"
);

fs.writeFileSync('src/context/GameContext.tsx', gc);
console.log('GameContext fixed');
