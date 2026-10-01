const fs = require('fs');
let parser = fs.readFileSync('src/lib/engine/parser.ts', 'utf8');

parser = parser.replace(
  "const playerC = shuffledPlayers[2] || 'Player C';",
  "const playerC = shuffledPlayers[2] || 'someone in the room';"
);
parser = parser.replace(
  "const playerD = shuffledPlayers[3] || 'Player D';",
  "const playerD = shuffledPlayers[3] || 'the person to your left';"
);

fs.writeFileSync('src/lib/engine/parser.ts', parser);
console.log('Parser patched');
