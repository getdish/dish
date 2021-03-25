/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/react-test-env" {
    import "mutationobserver-polyfill";
    export { render, cleanup, fireEvent, waitFor, screen } from "@testing-library/react";
    export { default as TestRenderer, act } from "react-test-renderer";
}
//# sourceMappingURL=types.d.ts.map
