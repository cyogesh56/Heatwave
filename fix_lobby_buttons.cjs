const fs = require('fs');
let code = fs.readFileSync('src/views/LobbyView.tsx', 'utf-8');

code = code.replace(
  'shadow-xl hover:-translate-y-1 transition-all active:scale-95',
  'shadow-solid hover:-translate-y-1 transition-all active:translate-y-[4px] active:shadow-none'
);

code = code.replace(
  'shadow-xl disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:scale-95',
  'shadow-solid disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 transition-all active:translate-y-[4px] active:shadow-none'
);

code = code.replace(
  'disabled:opacity-50 active:scale-95 transition-all',
  'disabled:opacity-50 active:scale-95 transition-all shadow-solid-sm active:translate-y-[2px] active:shadow-none'
);

fs.writeFileSync('src/views/LobbyView.tsx', code);
