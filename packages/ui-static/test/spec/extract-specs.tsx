import { Box, VStack } from '@dish/ui'
import React from 'react'

export function Test1() {
  return (
    <VStack flex={1} borderRadius={100} backgroundColor="red">
      <div>hi</div>
    </VStack>
  )
}

export function Test2() {
  return (
    <Box className="who" onAccessibilityTap={() => {}} overflow="hidden">
      <div>hi</div>
    </Box>
  )
}

// single spread at end
export function Test3(props: any) {
  return (
    <VStack onLayout={() => {}} overflow="hidden" {...props}>
      <div>hi</div>
    </VStack>
  )
}

// static + dynamic prop
const homePageBorderRadius = 10
export function Test4() {
  return (
    <VStack
      height={200}
      width={`calc(100% + ${homePageBorderRadius * 2}px)`}
      hoverStyle={{
        overflow: 'visible',
      }}
    />
  )
}

// spread
export function Test5(props: any) {
  return (
    <VStack
      overflow="hidden"
      {...(props.something && {
        background: 'blue',
      })}
    >
      <div />
    </VStack>
  )
}

// ternary
export function Test6(props: any) {
  return (
    <VStack
      overflow="hidden"
      {...(props.something
        ? {
            background: 'blue',
          }
        : null)}
    >
      <div />
    </VStack>
  )
}

// merged multiple ternary
export function Test7() {
  const isSmall = false
  const verticalPad = 10
  const pad = 5
  return (
    <VStack
      paddingHorizontal={pad + 6}
      paddingBottom={verticalPad}
      width={isSmall ? '50vw' : '66%'}
      minWidth={isSmall ? '50%' : 500}
      maxWidth={isSmall ? '80vw' : '30%'}
      spacing={5}
    >
      <div />
    </VStack>
  )
}
