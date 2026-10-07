const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

code = code.replace(
  'className="w-full lg:w-1/2 flex items-center justify-center shrink-0 max-h-[40vh] lg:max-h-none overflow-visible p-6"',
  'className="w-full lg:w-1/2 flex items-center justify-center shrink-0 p-6 sm:p-8 min-h-[300px]"'
);

fs.writeFileSync('src/views/HostView.tsx', code);
