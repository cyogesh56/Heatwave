const fs = require('fs');
let code = fs.readFileSync('src/components/ui/PlayingCard.tsx', 'utf-8');

code = code.replace(
  '  if (prompt.length > 150) {',
  '  if (prompt?.length > 150) {'
);
code = code.replace(
  '  } else if (prompt.length > 80) {',
  '  } else if (prompt?.length > 80) {'
);

fs.writeFileSync('src/components/ui/PlayingCard.tsx', code);
