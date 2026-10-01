const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const badUrl = 'family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
const goodUrl = 'family=Fraunces:ital,wght@0,100..900;1,100..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

html = html.replace(badUrl, goodUrl);
fs.writeFileSync('index.html', html);
console.log('Fixed font URL');
