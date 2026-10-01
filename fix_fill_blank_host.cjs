const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /if \(!\['kahoot', 'wrong_answers', 'consensus', 'vibe_poll'\]\.includes\(card\.type\)\) \{/,
  `if (!['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(card.type)) {`
);

code = code.replace(
  /card\.type === 'kahoot' \|\| card\.type === 'wrong_answers' \? 'Trivia & Chaos' :/,
  `card.type === 'kahoot' || card.type === 'wrong_answers' || card.type === 'fill_blank' ? 'Trivia & Chaos' :`
);

code = code.replace(
  /const isVoting = \['kahoot', 'wrong_answers', 'consensus', 'vibe_poll'\]\.includes\(drawn\.card\.type\);/,
  `const isVoting = ['kahoot', 'wrong_answers', 'consensus', 'vibe_poll', 'fill_blank'].includes(drawn.card.type);`
);

// We should also ensure the interstitial is correct for fill_blank
code = code.replace(
  /case 'wrong_answers':/,
  `case 'wrong_answers':\n                case 'fill_blank':`
);

fs.writeFileSync('src/views/HostView.tsx', code);
