import { useEffect, useRef } from 'react';
export const useLazyEffect = (cb, dep) => {
    const initializeRef = useRef(false);
    useEffect((...args) => {
        if (initializeRef.current) {
            cb(...args);
        }
        else {
            initializeRef.current = true;
        }
    }, dep);
};
