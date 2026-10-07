const fs = require('fs');

let hostView = fs.readFileSync('src/views/HostView.tsx', 'utf-8');
let controllerView = fs.readFileSync('src/views/ControllerView.tsx', 'utf-8');

// Fix 1: Error Boundary to catch crashes
const errorBoundary = `
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-12 text-red-500 font-meta">CRASH: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}
`;
if (!hostView.includes('class ErrorBoundary')) {
  hostView = hostView.replace("import React, { useEffect, useRef, useState } from 'react';", "import React, { useEffect, useRef, useState } from 'react';\n" + errorBoundary);
}

// Wrap the main return
hostView = hostView.replace("return (", "return (\n    <ErrorBoundary>");
hostView = hostView.replace(/}\);\n};/g, "  </ErrorBoundary>\n  );\n};\n");

// Fix 2: Remove React Elements from state, use strings
hostView = hostView.replace(/let interIcon = <IconEye[^>]+>;/, 'let interIconName = "IconEye";');
hostView = hostView.replace(/interIcon = <IconScale[^>]+>;/g, 'interIconName = "IconScale";');
hostView = hostView.replace(/interIcon = <IconZap[^>]+>;/g, 'interIconName = "IconZap";');
hostView = hostView.replace(/interIcon = <IconFlame[^>]+>;/g, 'interIconName = "IconFlame";');
hostView = hostView.replace(/icon: interIcon/g, 'icon: interIconName');

// Fix 3: Fix Phase update
hostView = hostView.replace(/players: newPlayers,/g, 'phase: drawn.card.phase,\n        players: newPlayers,');

// Fix 4: Fix Mobile Layout Toggle
hostView = hostView.replace(
  /<div className="relative w-full lg:w-1\/2 flex items-center justify-center shrink-0">/,
  '<div className={`relative w-full lg:w-1/2 items-center justify-center shrink-0 ${showMobileResults ? "hidden lg:flex" : "flex"}`}>'
);

// Fix 5: Ensure interstitial is parsed correctly in HostView
hostView = hostView.replace(
  /<div className="mb-8">{hostGameState.interstitial.icon}<\/div>/,
  `{hostGameState.interstitial.icon === 'IconScale' && <div className="mb-8"><IconScale className="w-12 h-12 lg:w-24 lg:h-24 opacity-80" /></div>}
           {hostGameState.interstitial.icon === 'IconZap' && <div className="mb-8"><IconZap className="w-12 h-12 lg:w-24 lg:h-24 opacity-80" /></div>}
           {hostGameState.interstitial.icon === 'IconFlame' && <div className="mb-8"><IconFlame className="w-12 h-12 lg:w-24 lg:h-24 opacity-80" /></div>}
           {hostGameState.interstitial.icon === 'IconEye' && <div className="mb-8"><IconEye className="w-12 h-12 lg:w-24 lg:h-24 opacity-80" /></div>}`
);

// Fix 6: Ensure interstitial is parsed correctly in ControllerView
controllerView = controllerView.replace(
  /<div className="mb-6">{clientState.interstitial.icon}<\/div>/,
  `{clientState.interstitial.icon === 'IconScale' && <div className="mb-6"><IconScale className="w-12 h-12 lg:w-24 lg:h-24 opacity-80" /></div>}
               {clientState.interstitial.icon === 'IconZap' && <div className="mb-6"><IconZap className="w-12 h-12 lg:w-24 lg:h-24 opacity-80" /></div>}
               {clientState.interstitial.icon === 'IconFlame' && <div className="mb-6"><IconFlame className="w-12 h-12 lg:w-24 lg:h-24 opacity-80" /></div>}
               {clientState.interstitial.icon === 'IconEye' && <div className="mb-6"><IconEye className="w-12 h-12 lg:w-24 lg:h-24 opacity-80" /></div>}`
);

if (!controllerView.includes('IconEye')) {
  controllerView = controllerView.replace("import { PlayingCard }", "import { IconZap, IconFlame, IconScale, IconEye } from '../components/icons';\nimport { PlayingCard }");
}

fs.writeFileSync('src/views/HostView.tsx', hostView);
fs.writeFileSync('src/views/ControllerView.tsx', controllerView);
console.log('Fixed');
