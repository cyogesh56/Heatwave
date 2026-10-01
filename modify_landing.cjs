const fs = require('fs');

let ld = fs.readFileSync('src/views/Landing.tsx', 'utf8');

// Update fire icon animation
ld = ld.replace(
  'className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-card rounded-3xl shadow-glow-active flex items-center justify-center border-4 border-accent-dare rotate-3"',
  'className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-card rounded-3xl shadow-glow-active flex items-center justify-center border-4 border-accent-dare rotate-3 animate-slow-bounce"'
);

// Update 2-4 Players text
ld = ld.replace(
  '<IconUsers className="w-5 h-5" /> 2-4 Players',
  '<IconUsers className="w-5 h-5" /> 2-4 Players • For Friends & Partners'
);

fs.writeFileSync('src/views/Landing.tsx', ld);
console.log('Landing modified');
