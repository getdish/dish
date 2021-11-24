var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function combineRefs(...refs) {
  if (refs.length === 2) {
    return composeTwoRefs(refs[0], refs[1]) || null;
  }
  const composedRef = refs.slice(1).reduce((semiCombinedRef, refToInclude) => composeTwoRefs(semiCombinedRef, refToInclude), refs[0]);
  return composedRef || null;
}
__name(combineRefs, "combineRefs");
const composedRefCache = new WeakMap();
function composeTwoRefs(ref1, ref2) {
  if (ref1 && ref2) {
    const ref1Cache = composedRefCache.get(ref1) || new WeakMap();
    composedRefCache.set(ref1, ref1Cache);
    const composedRef = ref1Cache.get(ref2) || ((instance) => {
      updateRef(ref1, instance);
      updateRef(ref2, instance);
    });
    ref1Cache.set(ref2, composedRef);
    return composedRef;
  }
  if (!ref1) {
    return ref2;
  } else {
    return ref1;
  }
}
__name(composeTwoRefs, "composeTwoRefs");
function updateRef(ref, instance) {
  if (typeof ref === "function") {
    ref(instance);
  } else {
    ;
    ref.current = instance;
  }
}
__name(updateRef, "updateRef");
export {
  combineRefs
};
