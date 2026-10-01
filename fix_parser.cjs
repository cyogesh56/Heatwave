const fs = require('fs');
let code = fs.readFileSync('src/lib/engine/parser.ts', 'utf-8');

code = code.replace(
  'parsedOptions?: string[] } {',
  'parsedOptions?: string[]; assignedResponderName?: string } {'
);

code = code.replace(
  'const targetedPlayers: string[] = [];',
  `const targetedPlayers: string[] = [];\n  let assignedResponderName: string | undefined = undefined;\n  const responderMatch = prompt.match(/\\[(Player [A-D])\\] answers\\.?/i);\n  if (responderMatch) {\n    if (responderMatch[1].toUpperCase() === 'PLAYER A') assignedResponderName = playerA;\n    else if (responderMatch[1].toUpperCase() === 'PLAYER B') assignedResponderName = playerB;\n    else if (responderMatch[1].toUpperCase() === 'PLAYER C') assignedResponderName = playerC;\n    else if (responderMatch[1].toUpperCase() === 'PLAYER D') assignedResponderName = playerD;\n  }`
);

code = code.replace(
  'parsedOptions\n  };',
  'parsedOptions,\n    assignedResponderName\n  };'
);

fs.writeFileSync('src/lib/engine/parser.ts', code);
