var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { useCallback, useRef, useState } from "react";
function useGet(currentValue) {
  const curRef = useRef(null);
  curRef.current = currentValue;
  return useCallback(() => curRef.current, [curRef]);
}
__name(useGet, "useGet");
function useGetFn(fn) {
  const getCur = useGet(fn);
  return (...args) => getCur()(...args);
}
__name(useGetFn, "useGetFn");
function useStateFn(currentValue) {
  const [state, setState] = useState(currentValue);
  const curRef = useRef();
  curRef.current = state;
  return [useCallback(() => curRef.current, []), setState];
}
__name(useStateFn, "useStateFn");
export {
  useGet,
  useGetFn,
  useStateFn
};
