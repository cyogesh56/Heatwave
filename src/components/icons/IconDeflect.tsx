import React from "react";

export function IconDeflect(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 15 3 9 9 3"></polyline>
      <path d="M21 21v-7a5 5 0 0 0-5-5H3"></path>
    </svg>
  );
}
