import { isWeb } from '@tamagui/core';
import { useDebounce } from '@tamagui/use-debounce';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
React['createElement'];
export const Hoverable = forwardRef(({ onPressIn, onPressOut, onHoverIn, onHoverOut, onHoverMove, disableUntilSettled, hoverDelay = 0, children, }, ref) => {
    if (!isWeb) {
        return children;
    }
    const [isActive, set] = useState(false);
    const setOffSlow = useDebounce(() => set(false), hoverDelay / 2);
    const setOnSlow = useDebounce(() => set(true), hoverDelay);
    const cancelAll = () => {
        setOnSlow.cancel();
        setOffSlow.cancel();
    };
    useImperativeHandle(ref, () => ({
        close: () => {
            set(false);
        },
    }));
    useEffect(() => {
        if (isActive) {
            onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn();
        }
        else {
            onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut();
        }
    }, [isActive]);
    const setOff = () => {
        cancelAll();
        setOffSlow();
    };
    const setOn = () => {
        cancelAll();
        setOnSlow();
    };
    const hoverMove = () => {
        if (onHoverMove)
            onHoverMove();
        if (disableUntilSettled)
            setOn();
    };
    return (<span ref={ref} style={{
            display: 'contents',
        }} onMouseEnter={setOn} onMouseLeave={setOff} onMouseMove={hoverMove} onMouseDown={onPressIn} onClick={onPressOut}>
        {children}
      </span>);
});
