const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf-8');

const meta = `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
`;

if (!code.includes('must-revalidate')) {
  code = code.replace('<head>', '<head>' + meta);
  fs.writeFileSync('index.html', code);
}
