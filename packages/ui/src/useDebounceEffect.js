import { useEffect } from 'react';
export const useDebounceEffect = (effect, amount, args) => {
    useEffect(() => {
        let dispose;
        const tm = setTimeout(() => {
            dispose = effect();
        }, amount);
        return () => {
            clearTimeout(tm);
            dispose === null || dispose === void 0 ? void 0 : dispose();
        };
    }, args);
};
