const fs = require('fs');

let hs = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');
hs = hs.replace(/  uiState: 'waiting' \| 'voting' \| 'ready_check' \| 'dare_active';/, "  uiState: 'waiting' | 'voting' | 'ready_check' | 'dare_active' | 'interstitial';\n  interstitial?: { title: string, subtitle: string };");
fs.writeFileSync('src/lib/peer/HostServer.ts', hs);

console.log('UI state updated');
