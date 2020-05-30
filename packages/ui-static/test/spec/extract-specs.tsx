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
    <VStack onHoverIn={() => {}} overflow="hidden" {...props}>
      <div>hi</div>
    </VStack>
  )
}

// static + dynamic prop
const homePageBorderRadius = 10
export function Test4() {
  return (
    <VStack height={200} width={`calc(100% + ${homePageBorderRadius * 2}px)`} />
  )
}

// complex spreads and ternary
export function Test5(props: any) {
  return (
    <VStack
      overflow="hidden"
      {...(props.something && {
        background: 'blue',
      })}
      {...props}
      style={{ background: 'green' }}
    >
      <div />
    </VStack>
  )
}

// hoverStyle
export function Test6(props: any) {
  return (
    <VStack
      overflow="hidden"
      hoverStyle={{
        overflow: 'visible',
      }}
    >
      <div />
    </VStack>
  )
}

export * from '@dish/ui'
