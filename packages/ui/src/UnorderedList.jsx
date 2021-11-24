import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
export const UnorderedList = (props) => {
    return <YStack paddingLeft="$4" {...props}/>;
};
export const UnorderedListItem = ({ children, size, ...props }) => {
    return (<XStack marginVertical="$1">
      <Text {...props} size={size}>{`\u2022`}</Text>
      <Text flex={1} paddingLeft="$4" size={size} {...props}>
        {children}
      </Text>
    </XStack>);
};
