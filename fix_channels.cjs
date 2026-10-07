const fs = require('fs');

let hostCode = fs.readFileSync('src/lib/peer/HostServer.ts', 'utf-8');
hostCode = hostCode.replace(
  "config: { presence: { key: 'host' } }",
  "config: { broadcast: { self: true }, presence: { key: 'host' } }"
);
fs.writeFileSync('src/lib/peer/HostServer.ts', hostCode);

let clientCode = fs.readFileSync('src/lib/peer/ClientNode.ts', 'utf-8');
clientCode = clientCode.replace(
  "config: { presence: { key: this.playerId } }",
  "config: { broadcast: { self: true }, presence: { key: this.playerId } }"
);
fs.writeFileSync('src/lib/peer/ClientNode.ts', clientCode);
