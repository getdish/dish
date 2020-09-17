import { StackProps, VStack } from '@dish/ui'
import React from 'react'

import { useIsNarrow } from '../../hooks/useIs'

export type SectionContentProps = StackProps & {
  outside?: React.ReactNode
  pages?: number | 'auto'
}

export const PageContent = ({
  outside,
  children,
  zIndex,
  backgroundColor,
  padding,
  height,
  minHeight,
  maxHeight,
  flex,
  ...props
}: SectionContentProps) => {
  const isNarrow = useIsNarrow()
  return (
    <VStack
      zIndex={zIndex}
      width="100%"
      position="relative"
      alignItems="center"
      backgroundColor={backgroundColor || 'transparent'}
      padding={padding}
      height={height}
      flex={flex}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      {outside}
      <VStack
        minHeight="100%"
        maxHeight="100%"
        width="100%"
        maxWidth="100vw"
        paddingHorizontal={20}
        position="relative"
        flex={flex}
        {...(isNarrow && {
          width: '100%',
          minWidth: 'auto',
          maxWidth: 'auto',
          paddingLeft: '2%',
          paddingRight: '2%',
        })}
        {...props}
      >
        {children}
      </VStack>
    </VStack>
  )
}
