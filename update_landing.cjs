const fs = require('fs');
let code = fs.readFileSync('src/views/Landing.tsx', 'utf8');
code = code.replace(/alert\('Failed to connect to room'\);/, "alert('Failed to connect to room: ' + err.type + ' / ' + err.message);");
fs.writeFileSync('src/views/Landing.tsx', code);
