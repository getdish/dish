var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { useEffect, useRef } from "react";
const useLazyEffect = /* @__PURE__ */ __name((cb, dep) => {
  const initializeRef = useRef(false);
  useEffect((...args) => {
    if (initializeRef.current) {
      cb(...args);
    } else {
      initializeRef.current = true;
    }
  }, dep);
}, "useLazyEffect");
export {
  useLazyEffect
};
