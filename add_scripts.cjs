const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
pkg.scripts.predeploy = "npm run build && cp dist/index.html dist/404.html";
pkg.scripts.deploy = "gh-pages -d dist";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
