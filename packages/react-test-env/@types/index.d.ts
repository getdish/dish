declare module "@dish/react-test-env" {
    import '@dish/helpers/polyfill';
    import 'mutationobserver-polyfill';
    export { render, cleanup, fireEvent, waitFor, screen, } from '@testing-library/react';
    export { default as TestRenderer, act } from 'react-test-renderer';
}
