import { getSize } from '@tamagui/core';
import { YStack, styled } from 'tamagui';
export const SlantedYStack = styled(YStack, {
    name: 'SlantedYStack',
    backgroundColor: '$background',
    position: 'relative',
    zIndex: 10,
    variants: {
        size: {
            '...size': (val) => {
                return {
                    borderRadius: val,
                    px: val,
                    py: getSize(val, -2)
                };
            }
        }
    }
});
