const fs = require('fs');

let parser = fs.readFileSync('src/lib/engine/parser.ts', 'utf8');

parser = parser.replace(
  /const playerA = shuffledPlayers\[0\];\s*const playerB = shuffledPlayers\[1\];/,
  `const playerA = shuffledPlayers[0] || 'Player A';
  const playerB = shuffledPlayers[1] || 'Player B';
  const playerC = shuffledPlayers[2] || 'Player C';
  const playerD = shuffledPlayers[3] || 'Player D';`
);

parser = parser.replace(
  /let parsedText = prompt\s*\.replace\(\/\\\[Player A\\\]\/g, playerA\)\s*\.replace\(\/\\\[Player B\\\]\/g, playerB\);/,
  `let parsedText = prompt
    .replace(/\\[Player A\\]/g, playerA)
    .replace(/\\[Player B\\]/g, playerB)
    .replace(/\\[Player C\\]/g, playerC)
    .replace(/\\[Player D\\]/g, playerD);`
);

fs.writeFileSync('src/lib/engine/parser.ts', parser);
console.log('Parser fixed');
