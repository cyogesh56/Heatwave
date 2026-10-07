const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf-8');
code = code.replace(
  'className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-display font-black text-center mb-6 sm:mb-8 uppercase tracking-wide">Connect Device',
  'className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-center mb-6 sm:mb-8 uppercase tracking-wide">Connect Device'
);
fs.writeFileSync('src/views/Landing.tsx', code);
