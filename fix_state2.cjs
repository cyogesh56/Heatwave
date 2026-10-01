const fs = require('fs');

let hs = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');
hs = hs.replace(/    isConnected\?: boolean;\n  }>;/, "    isConnected?: boolean;\n    uiAlert?: string;\n  }>;");
fs.writeFileSync('src/lib/peer/HostServer.ts', hs);

console.log('State fixed 2');
