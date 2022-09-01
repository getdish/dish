import { AnimationKeys } from '@tamagui/core';
import React from 'react';
export declare type ToastOptions = {
    duration?: number;
    type?: 'info' | 'success' | 'error';
};
export declare const Toast: {
    clear: () => void;
    show: (content: any, options?: ToastOptions) => void;
    error: (content: any, options?: Omit<ToastOptions, 'type'>) => void;
    success: (content: any, options?: Omit<ToastOptions, 'type'>) => void;
};
export declare const ToastRoot: React.NamedExoticComponent<{
    animation?: AnimationKeys | undefined;
}>;
