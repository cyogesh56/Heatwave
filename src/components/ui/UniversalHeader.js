import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function UniversalHeader({ leftNode, rightNode }) {
    return (_jsxs("header", { className: "h-[8%] min-h-[70px] flex items-center justify-between px-6 border-b-4 border-ink-primary/10 shrink-0 bg-surface-card z-50 w-full relative", children: [_jsx("div", { className: "flex-1 flex justify-start items-center overflow-visible", children: leftNode }), _jsx("div", { className: "flex-1 flex justify-end items-center overflow-visible", children: rightNode })] }));
}
