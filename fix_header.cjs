const fs = require('fs');
let code = fs.readFileSync('src/components/ui/UniversalHeader.tsx', 'utf-8');
code = code.replace(/overflow-hidden/g, 'overflow-visible');
fs.writeFileSync('src/components/ui/UniversalHeader.tsx', code);
