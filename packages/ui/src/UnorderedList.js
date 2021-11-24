import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
export const UnorderedList = (props) => {
    return React.createElement(YStack, { paddingLeft: "$4", ...props });
};
export const UnorderedListItem = ({ children, size, ...props }) => {
    return (React.createElement(XStack, { marginVertical: "$1" },
        React.createElement(Text, { ...props, size: size }, `\u2022`),
        React.createElement(Text, { flex: 1, paddingLeft: "$4", size: size, ...props }, children)));
};
