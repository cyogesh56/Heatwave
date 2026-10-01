const fs = require('fs');
let hs = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');
hs = hs.replace(/  uiAlert\?: string;\n\};/, "  uiAlert?: string;\n  theme?: 'light' | 'dark';\n};");
fs.writeFileSync('src/lib/peer/HostServer.ts', hs);
console.log('HostServer updated');
