const fs = require('fs');
let code = fs.readFileSync('src/context/GameContext.tsx', 'utf-8');

code = code.replace(
  "if (!hostServer) setIsHost(false);",
  "if (sessionStorage.getItem('hostlessMode') !== 'true') setIsHost(false);"
);

fs.writeFileSync('src/context/GameContext.tsx', code);
