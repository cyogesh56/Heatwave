const fs = require('fs');
let hv = fs.readFileSync('src/views/HostView.tsx', 'utf8');

// Inject uiAlert into nextState
hv = hv.replace(
  "        timers: {\n          active: !!futureTimer,\n          endsAt: futureTimer,\n          remainingSeconds: 0\n        }\n      };",
  "        timers: {\n          active: !!futureTimer,\n          endsAt: futureTimer,\n          remainingSeconds: 0\n        },\n        uiAlert: alertMsg || undefined\n      };"
);

// Fix clearing of uiAlert in setTimeout
hv = hv.replace(
  "                if (p[targetPlayerId]) {\n                   p[targetPlayerId] = { ...p[targetPlayerId], uiAlert: undefined };\n                }\n                const n = { ...prev, players: p };",
  "                if (p[targetPlayerId]) {\n                   p[targetPlayerId] = { ...p[targetPlayerId], uiAlert: undefined };\n                }\n                const n = { ...prev, players: p, uiAlert: undefined };"
);

fs.writeFileSync('src/views/HostView.tsx', hv);
console.log('HostView alert fixed');
