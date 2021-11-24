import { useEffect } from 'react';
export function useOnMount(cb) {
    useEffect(() => cb(), []);
}
