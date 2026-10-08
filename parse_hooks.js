const fs = require('fs');
const content = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

const lines = content.split('\n');
let insideIf = false;
let blockDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('if (')) {
    if (!line.includes(') return') && !line.includes('{')) {
      // rough
    }
  }
  if (line.includes('use')) {
    console.log(`${i + 1}: ${line}`);
  }
}
