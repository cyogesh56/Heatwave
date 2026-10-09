import React from 'react';

interface UniversalHeaderProps {
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  notchNode?: React.ReactNode;
}

export function UniversalHeader({ leftNode, rightNode, notchNode }: UniversalHeaderProps) {
  return (
    <header className="min-h-[60px] flex items-center justify-between px-4 sm:px-6 border-b-4 border-ink-primary/10 shrink-0 bg-surface-card z-[60] w-full relative">
      <div className="flex-1 flex justify-start items-center overflow-visible">
        {leftNode}
      </div>
      <div className="flex-1 flex justify-end items-center overflow-visible">
        {rightNode}
      </div>
      {notchNode && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 flex items-center justify-center -mt-[4px]">
           <div className="bg-surface-card border-x-4 border-b-4 border-ink-primary/10 rounded-b-[1.5rem] p-1.5 flex items-center justify-center gap-1 z-10 relative">
             <div className="absolute -top-[1.2rem] -left-[1.25rem] w-5 h-5 bg-transparent shadow-[10px_10px_0_0_#FFFFFF] pointer-events-none" style={{ borderRadius: '0 0 100% 0' }} />
             <div className="absolute -top-[1.2rem] -right-[1.25rem] w-5 h-5 bg-transparent shadow-[-10px_10px_0_0_#FFFFFF] pointer-events-none" style={{ borderRadius: '0 0 0 100%' }} />
             {notchNode}
           </div>
        </div>
      )}
    </header>
  );
}
