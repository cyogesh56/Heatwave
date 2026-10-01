const fs = require('fs');

let code = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

code = code.replace(
  /if \(questionType === 'kahoot' \|\| questionType === 'wrong_answers' \|\| questionType === 'wrong'\) return 'Trivia & Chaos';/,
  `if (questionType === 'kahoot' || questionType === 'wrong_answers' || questionType === 'wrong' || questionType === 'fill_blank') return 'Trivia & Chaos';`
);

code = code.replace(
  /questionType === 'wrong' \|\| questionType === 'wrong_answers' \|\| questionType === 'consensus' \|\| questionType === 'vibe_poll' \|\| questionType === 'kahoot' \?/,
  `questionType === 'wrong' || questionType === 'wrong_answers' || questionType === 'consensus' || questionType === 'vibe_poll' || questionType === 'kahoot' || questionType === 'fill_blank' ?`
);

fs.writeFileSync('src/views/ControllerView.tsx', code);
