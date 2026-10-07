import React from 'react';

interface UniversalHeaderProps {
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
}

export function UniversalHeader({ leftNode, rightNode }: UniversalHeaderProps) {
  return (
    <header className="h-[8%] min-h-[70px] flex items-center justify-between px-6 border-b-4 border-ink-primary/10 shrink-0 bg-surface-card z-50 w-full relative">
      <div className="flex-1 flex justify-start items-center overflow-visible">
        {leftNode}
      </div>
      <div className="flex-1 flex justify-end items-center overflow-visible">
        {rightNode}
      </div>
    </header>
  );
}
