import * as ts from 'typescript';
import * as fs from 'fs';

const file = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
const sourceFile = ts.createSourceFile('HostView.tsx', file, ts.ScriptTarget.Latest, true);

let hookCount = 0;
function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
        const expression = node.expression;
        let text = '';
        if (ts.isIdentifier(expression)) text = expression.text;
        else if (ts.isPropertyAccessExpression(expression)) text = expression.name.text;
        
        if (text.startsWith('use') && text.length > 3 && text[3] === text[3].toUpperCase()) {
            console.log(`Found hook: ${text} at line ${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
            hookCount++;
        }
    }
    ts.forEachChild(node, visit);
}

visit(sourceFile);
console.log(`Total hooks found: ${hookCount}`);
