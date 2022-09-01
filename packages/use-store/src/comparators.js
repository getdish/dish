import { isEqual } from '@dish/fast-compare';
export const isEqualSubsetShallow = (a, b, opts) => isEqual(a, b, { maxDepth: 2, ...opts });
export const isEqualStrict = (a, b) => a === b;
