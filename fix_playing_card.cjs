const fs = require('fs');

let code = fs.readFileSync('src/components/ui/PlayingCard.tsx', 'utf-8');

code = code.replace(
  /type: 'wrong' \| 'consensus' \| 'truth' \| 'dare' \| 'kahoot' \| 'wrong_answers';/,
  `type: 'wrong' | 'consensus' | 'truth' | 'dare' | 'kahoot' | 'wrong_answers' | 'fill_blank' | 'vibe_poll';`
);

code = code.replace(
  /const normalizedType = type === 'kahoot' \|\| type === 'wrong_answers' \? 'wrong' : type;/,
  `const normalizedType = type === 'kahoot' || type === 'wrong_answers' || type === 'fill_blank' ? 'wrong' : type === 'vibe_poll' ? 'consensus' : type;`
);

fs.writeFileSync('src/components/ui/PlayingCard.tsx', code);
