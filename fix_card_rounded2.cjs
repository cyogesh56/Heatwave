const fs = require('fs');
let code = fs.readFileSync('src/components/ui/PlayingCard.tsx', 'utf-8');
code = code.replace(
  'rounded-none flex flex-col',
  'rounded-2xl flex flex-col'
);
fs.writeFileSync('src/components/ui/PlayingCard.tsx', code);
