var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { useEffect } from "react";
const useDebounceEffect = /* @__PURE__ */ __name((effect, amount, args) => {
  useEffect(() => {
    let dispose;
    const tm = setTimeout(() => {
      dispose = effect();
    }, amount);
    return () => {
      clearTimeout(tm);
      dispose?.();
    };
  }, args);
}, "useDebounceEffect");
export {
  useDebounceEffect
};
