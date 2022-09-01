import { AnimatePresence } from '@tamagui/animate-presence';
import { Theme, isWeb } from '@tamagui/core';
import { YStack } from '@tamagui/stacks';
import { Paragraph } from '@tamagui/text';
import { useForceUpdate } from '@tamagui/use-force-update';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
let clear = () => { };
let show = (content) => {
    console.warn('Note:', content);
};
export const Toast = {
    clear,
    show: (content, options) => show(content, options),
    error: (content, options) => show(content, { ...options, type: 'error' }),
    success: (content, options) => show(content, { ...options, type: 'success' }),
};
if (typeof window !== 'undefined') {
    window['Toast'] = Toast;
}
export const ToastRoot = memo(function ToastRoot(props) {
    const forceUpdate = useForceUpdate();
    const stateRef = useRef({
        show: false,
        content: '',
        type: 'info',
        timeout: null,
    });
    const setState = (x) => {
        stateRef.current = x;
        forceUpdate();
    };
    useEffect(() => {
        return () => {
            var _a;
            clearTimeout((_a = stateRef.current.timeout) !== null && _a !== void 0 ? _a : 0);
        };
    }, []);
    clear = () => {
        setState({ show: false, content: '' });
    };
    show = useCallback((content, { duration = 3000, type = 'info' } = {}) => {
        var _a;
        clearTimeout((_a = stateRef.current.timeout) !== null && _a !== void 0 ? _a : 0);
        const timeout = setTimeout(() => {
            setState({
                show: false,
                content: '',
                type,
                timeout: null,
            });
        }, duration);
        setState({
            show: true,
            content,
            type,
            timeout,
        });
    }, [stateRef]);
    const state = stateRef.current;
    const contents = (<YStack pointerEvents="none" fullscreen position={isWeb ? 'fixed' : 'absolute'} alignItems="center" justifyContent="flex-end" zIndex={10000000000} padding="5%">
      <Theme name={state.type === 'info' ? null : state.type === 'success' ? 'green' : 'red'}>
        <AnimatePresence>
          {state.show && !!state.content && (<YStack animation={props.animation || 'toast'} backgroundColor="$background" elevation="$2" borderRadius="$4" paddingHorizontal="$4" paddingVertical="$3">
              <Paragraph>{state.content}</Paragraph>
            </YStack>)}
        </AnimatePresence>
      </Theme>
    </YStack>);
    const portalEl = document.getElementById('toasts');
    if (isWeb && portalEl) {
        return createPortal(contents, portalEl);
    }
    return contents;
});
