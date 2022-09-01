import { YStack } from '@tamagui/stacks';
import React from 'react';
export function BlurView({ children, borderRadius, fallbackBackgroundColor, blurType, blurAmount = 20, downsampleFactor, ...props }) {
    return (<YStack position="relative" borderRadius={borderRadius} {...props}>
      <div className="backdrop-filter" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backdropFilter: `blur(${blurAmount}px)`,
            borderRadius,
            zIndex: -1,
            pointerEvents: 'none',
        }}/>
      {children}
    </YStack>);
}
