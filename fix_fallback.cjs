const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /drawn\.card\.type === 'kahoot' \|\| drawn\.card\.type === 'wrong_answers' \|\| drawn\.card\.type === 'consensus'/,
  `drawn.card.type === 'kahoot' || drawn.card.type === 'wrong_answers' || drawn.card.type === 'consensus' || drawn.card.type === 'fill_blank'`
);

fs.writeFileSync('src/views/HostView.tsx', code);
