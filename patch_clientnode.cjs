const fs = require('fs');
let code = fs.readFileSync('src/lib/peer/ClientNode.ts', 'utf-8');

const target = `.on('broadcast', { event: 'host-state' }, (payload) => {`;
const insert = `.on('presence', { event: 'sync' }, () => {
          const state = this.channel!.presenceState();
          if (isResolved && !state['host']) {
             console.warn("Host disconnected from presence!");
             this.onDisconnect();
          }
        })
        .on('broadcast', { event: 'host-state' }, (payload) => {`;

code = code.replace(target, insert);

fs.writeFileSync('src/lib/peer/ClientNode.ts', code);
