import { useCallback, useRef, useState } from 'react';
export function useGet(currentValue) {
    const curRef = useRef(null);
    curRef.current = currentValue;
    return useCallback(() => curRef.current, [curRef]);
}
export function useGetFn(fn) {
    const getCur = useGet(fn);
    return (...args) => getCur()(...args);
}
export function useStateFn(currentValue) {
    const [state, setState] = useState(currentValue);
    const curRef = useRef();
    curRef.current = state;
    return [useCallback(() => curRef.current, []), setState];
}
