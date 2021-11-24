import React from 'react';
import { Spacer, XStack, YStack } from 'tamagui';
export const LoadingItems = () => (React.createElement(YStack, { spacing: "sm", width: "100%" },
    React.createElement(LoadingItem, null),
    React.createElement(LoadingItem, null),
    React.createElement(LoadingItem, null)));
export const LoadingItemsSmall = () => (React.createElement(YStack, { spacing: "xs", width: "100%" },
    React.createElement(LoadingItem, { size: "sm" }),
    React.createElement(LoadingItem, { size: "sm" }),
    React.createElement(LoadingItem, { size: "sm" })));
const seed = Math.max(3, Math.min(6, Math.round(Math.random() * 10)));
export const LoadingItem = ({ size = 'md', lines = 3, }) => {
    return (React.createElement(YStack, { width: "100%", overflow: "hidden", padding: 16 },
        React.createElement(XStack, { width: `${seed * 12}%`, height: size === 'sm' ? 14 : size === 'lg' ? 36 : 28, backgroundColor: "rgba(150,150,150,0.085)", borderRadius: 12 }),
        React.createElement(Spacer, { size: size === 'sm' ? 6 : size === 'lg' ? 16 : 12 }),
        new Array(lines).fill(0).map((_, index) => (React.createElement(React.Fragment, { key: index },
            React.createElement(XStack, { className: "shine", width: `${seed * (15 - (2 - index > -1 ? index : -index) * 4)}%`, height: size === 'sm' ? 14 : size === 'lg' ? 22 : 16, maxWidth: "100%", backgroundColor: "rgba(150,150,150,0.015)", borderRadius: 8 }),
            React.createElement(Spacer, { size: size === 'sm' ? 6 : 12 }))))));
};
