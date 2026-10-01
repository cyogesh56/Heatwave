const fs = require('fs');
let tw = fs.readFileSync('tailwind.config.js', 'utf8');
tw = tw.replace('extend: {', `extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'slow-bounce': 'float 3s ease-in-out infinite',
      },`);
fs.writeFileSync('tailwind.config.js', tw);
console.log('Animation added');
