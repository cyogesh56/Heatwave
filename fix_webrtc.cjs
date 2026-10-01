const fs = require('fs');

let clientNode = fs.readFileSync('src/lib/peer/ClientNode.ts', 'utf8');
clientNode = clientNode.replace(/this\.peer = new Peer\(\{ debug: 2 \}\);/, `this.peer = new Peer({ 
        debug: 2,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });`);
clientNode = clientNode.replace(/this\.conn = this\.peer!\.connect\(hostPeerId, \{\s*reliable: true,\s*\}\);/, `this.conn = this.peer!.connect(hostPeerId);`);
fs.writeFileSync('src/lib/peer/ClientNode.ts', clientNode);

let hostServer = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf8');
hostServer = hostServer.replace(/this\.peer = new Peer\(peerId, \{\s*debug: 2,\s*\}\);/, `this.peer = new Peer(peerId, {
        debug: 2,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });`);
fs.writeFileSync('src/lib/peer/HostServer.ts', hostServer);
