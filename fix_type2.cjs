const fs = require('fs');

let sm = fs.readFileSync('src/lib/engine/stateMachine.ts', 'utf8');

sm = sm.replace(/export type Card = \{\\n  options\?: string\[\];/g, `export type Card = {`);

sm = sm.replace(/export type Card = \{/g, `export type Card = {
  options?: string[];`);

fs.writeFileSync('src/lib/engine/stateMachine.ts', sm);
