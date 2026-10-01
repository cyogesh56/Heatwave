const fs = require('fs');
let code = fs.readFileSync('src/lib/engine/stateMachine.ts', 'utf-8');

code = code.replace(
  'targetedPlayers?: string[] } | null {',
  'targetedPlayers?: string[]; assignedResponderName?: string } | null {'
);

code = code.replace(
  'targetedPlayers: parsed.targetedPlayers\n    };',
  'targetedPlayers: parsed.targetedPlayers,\n      assignedResponderName: parsed.assignedResponderName\n    };'
);

fs.writeFileSync('src/lib/engine/stateMachine.ts', code);
