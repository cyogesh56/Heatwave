const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');

const code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });

traverse(ast, {
  CallExpression(path) {
    if (path.node.callee.name && path.node.callee.name.startsWith('use')) {
      console.log(`Hook ${path.node.callee.name} at line ${path.node.loc.start.line}`);
    } else if (path.node.callee.property && path.node.callee.property.name === 'useEffect') {
      console.log(`Hook useEffect at line ${path.node.loc.start.line}`);
    } else if (path.node.callee.property && path.node.callee.property.name === 'useRef') {
      console.log(`Hook useRef at line ${path.node.loc.start.line}`);
    }
  }
});
