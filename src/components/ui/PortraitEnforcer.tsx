import React from 'react';

export function PortraitEnforcer() {
  return (
    <>
      <style>{`
        .portrait-enforcer {
          display: none;
        }
        @media (pointer: coarse) and (max-height: 500px) and (orientation: landscape) {
          .portrait-enforcer {
            display: flex !important;
          }
        }
      `}</style>
      <div className="portrait-enforcer fixed inset-0 z-[99999] bg-canvas flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mb-8 animate-[spin_2s_ease-in-out_infinite]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-accent-truth">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-ink-primary uppercase tracking-wide mb-4">
          Rotate Device
        </h2>
        <p className="text-lg font-body text-ink-primary/70 max-w-sm font-medium leading-relaxed">
          This game is best played in portrait mode. Please rotate your screen back to continue.
        </p>
      </div>
    </>
  );
}
