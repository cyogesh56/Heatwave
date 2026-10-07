const fs = require('fs');
let code = fs.readFileSync('src/views/HostView.tsx', 'utf-8');

// 1. Remove the old inline block
const oldBlock = `
      <AnimatePresence>
        {uiAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 lg:top-auto lg:bottom-32 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none w-11/12 max-w-lg"
          >
            <div className="bg-surface-card text-ink-primary border-4 border-accent-dare rounded-2xl px-6 py-4 shadow-2xl text-center backdrop-blur-xl">
              <span className="text-sm lg:text-base font-display font-black uppercase tracking-widest leading-snug">
                {uiAlert}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
`;
code = code.replace(oldBlock, '{/* uiAlert removed */}');

// 2. Define the component at the top of the file
const componentDef = `
const HostAlertOverlay = ({ uiAlert }: { uiAlert?: string }) => (
  <AnimatePresence>
    {uiAlert && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-24 lg:top-auto lg:bottom-32 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none w-11/12 max-w-lg"
      >
        <div className="bg-surface-card text-ink-primary border-4 border-accent-dare rounded-2xl px-6 py-4 shadow-2xl text-center backdrop-blur-xl">
          <span className="text-sm lg:text-base font-display font-black uppercase tracking-widest leading-snug">
            {uiAlert}
          </span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const HostView: React.FC = () => {
`;
code = code.replace('export const HostView: React.FC = () => {', componentDef);

// 3. Inject it into the interstitial view
code = code.replace(
  'className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-12 text-center"',
  'className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-accent-dare text-canvas p-12 text-center"\n      >\n        <HostAlertOverlay uiAlert={uiAlert} />'
);

// 4. Inject it into the main view
code = code.replace(
  '{/* Bottom Bar: Online Players */}',
  '<HostAlertOverlay uiAlert={uiAlert} />\n      {/* Bottom Bar: Online Players */}'
);

fs.writeFileSync('src/views/HostView.tsx', code);
