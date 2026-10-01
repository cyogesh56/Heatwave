const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/class GlobalErrorBoundary[\s\S]*?\}\n/, '');
app = app.replace(/<GlobalErrorBoundary>\n      <GameProvider>/, '<GameProvider>');
app = app.replace(/<\/GameProvider>\n      <\/GlobalErrorBoundary>/, '</GameProvider>');
fs.writeFileSync('src/App.tsx', app);

let cv = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');
cv = cv.replace(/class ErrorBoundary[\s\S]*?\}\n/, '');
cv = cv.replace(/<ErrorBoundary>\n    <div className="relative w-full/, '<div className="relative w-full');
cv = cv.replace(/<\/div>\n    <\/ErrorBoundary>\n  \);\n\};\n$/, '</div>\n  );\n};\n');
fs.writeFileSync('src/views/ControllerView.tsx', cv);
