const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf-8');

const targetHeadEnd = "</head>";
const metaTags = `
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" href="/favicon.ico" />
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Heatwave is the ultimate adult party card game. Play sensual games, erotic games, and spicy sex games with your partner or polycule using your phones as controllers." />
    <meta name="keywords" content="sensual games, sex games, erotic game, card games, adult party game, couples game, polyamory game, spicy games, truth or dare" />
    <meta name="author" content="Heatwave Games" />
    <meta name="robots" content="index, follow" />
    
    <!-- Open Graph / Social -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Heatwave | The Ultimate Adult Party Game" />
    <meta property="og:description" content="Turn up the heat. Play sensual and spicy card games with your partner or polycule using just your phones." />
    <meta property="og:image" content="/og-image.jpg" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Heatwave | The Ultimate Adult Party Game" />
    <meta name="twitter:description" content="Turn up the heat. Play sensual and spicy card games with your partner or polycule using just your phones." />
`;

code = code.replace(targetHeadEnd, metaTags + "\n  </head>");

// Also make sure title is good
code = code.replace("<title>Vite + React + TS</title>", "<title>Heatwave | The Ultimate Adult Party Game</title>");
code = code.replace("<title>Heatwave</title>", "<title>Heatwave | The Ultimate Adult Party Game</title>");

fs.writeFileSync('index.html', code);
