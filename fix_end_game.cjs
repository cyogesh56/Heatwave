const fs = require('fs');

let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  /                  setTimeout\(\(\) => \{\n                    window\.location\.href = '\/';\n                  \}, 500\);/,
  ''
);

fs.writeFileSync('src/views/HostView.tsx', code);
