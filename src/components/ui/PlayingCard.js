import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconZap, IconFlame, IconScale, IconEye } from '../icons';
const TYPE_CONFIG = {
    wrong: { border: 'border-accent-wrong-stroke', text: 'text-accent-wrong-stroke', Icon: IconZap },
    wrong_answers: { border: 'border-accent-wrong-stroke', text: 'text-accent-wrong-stroke', Icon: IconZap },
    kahoot: { border: 'border-accent-wrong-stroke', text: 'text-accent-wrong-stroke', Icon: IconZap },
    consensus: { border: 'border-accent-consensus-stroke', text: 'text-accent-consensus-stroke', Icon: IconScale },
    truth: { border: 'border-accent-truth', text: 'text-accent-truth', Icon: IconEye },
    dare: { border: 'border-accent-dare', text: 'text-accent-dare', Icon: IconFlame },
};
export function PlayingCard({ prompt, type, index }) {
    const normalizedType = type === 'kahoot' || type === 'wrong_answers' || type === 'fill_blank' ? 'wrong' : type === 'vibe_poll' ? 'consensus' : type;
    const config = TYPE_CONFIG[normalizedType] || TYPE_CONFIG.truth;
    const { border, text, Icon } = config;
    let textClass = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
    if (prompt?.length > 150) {
        textClass = "text-lg sm:text-xl md:text-2xl lg:text-3xl";
    }
    else if (prompt?.length > 80) {
        textClass = "text-xl sm:text-2xl md:text-3xl lg:text-4xl";
    }
    return (_jsx("div", { className: "w-full h-full bg-surface-card rounded-3xl shadow-solid p-2.5 relative flex flex-col transition-colors duration-500", children: _jsxs("div", { className: `relative w-full h-full border-[4px] ${border} rounded-[14px] flex flex-col items-center justify-center p-4 transition-colors duration-500`, children: [_jsx("div", { className: `absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-surface-card border-2 ${border} flex items-center justify-center transition-colors duration-500 z-10`, children: Icon && _jsx(Icon, { className: `w-4 h-4 ${text}` }) }), _jsxs("div", { className: "absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-ink-primary/5 rounded-full font-meta text-xs uppercase tracking-wider text-ink-primary/70", children: ["Phase ", index || 1] }), _jsx("h2", { className: `font-display font-extrabold ${textClass} text-center text-ink-primary max-w-[95%] tracking-tight`, children: prompt }), _jsx("div", { className: `absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-surface-card border-2 ${border} flex items-center justify-center transition-colors duration-500 z-10`, children: Icon && _jsx(Icon, { className: `w-4 h-4 ${text}` }) })] }) }));
}
