const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf-8');

if (!code.includes('build: {')) {
  code = code.replace(
    /export default defineConfig\(\{/,
    `export default defineConfig({\n  build: {\n    target: 'es2015'\n  },`
  );
  fs.writeFileSync('vite.config.ts', code);
}
