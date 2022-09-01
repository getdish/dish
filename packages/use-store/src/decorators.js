import { isEqual } from '@dish/fast-compare';
import { isEqualStrict, isEqualSubsetShallow } from './comparators';
export function compare(comparator) {
    return (target, propertyKey) => {
        target['_comparators'] = target['_comparators'] || {};
        target['_comparators'][propertyKey] = comparator;
    };
}
export const compareStrict = compare(isEqualStrict);
export const compareShallow = compare(isEqualSubsetShallow);
export const compareDeep = compare(isEqual);
