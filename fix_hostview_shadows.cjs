const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  'active:translate-y-0.5 active:shadow-none',
  'active:translate-y-[2px] active:shadow-none'
);
code = code.replace(
  'shadow-solid hover:-translate-y-2 transition-all active:scale-95',
  'shadow-solid hover:-translate-y-2 transition-all active:translate-y-[4px] active:shadow-none'
);

fs.writeFileSync('src/views/HostView.tsx', code);
