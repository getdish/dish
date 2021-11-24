var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { useEffect } from "react";
function useOnMount(cb) {
  useEffect(() => cb(), []);
}
__name(useOnMount, "useOnMount");
export {
  useOnMount
};
