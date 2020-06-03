import { Box, Text, VStack, ZStack } from '@dish/ui'
import React from 'react'

const nonStaticInt = eval(`10`)

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
export function Test4() {
  return (
    <VStack
      height={200}
      width={`calc(100% + ${nonStaticInt * 2}px)`}
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

// evaluates away
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
    >
      <VStack width={nonStaticInt ? 10 : 0} height={nonStaticInt ? 10 : 0} />
    </VStack>
  )
}

// merged multiple ternary + override
export function Test8() {
  return (
    <ZStack fullscreen position="relative">
      <div />
    </ZStack>
  )
}

// combines with classname
export function Test9() {
  return <VStack paddingVertical={15} className="home-top-dish" />
}

// Text
export function Test10() {
  return <Text fontSize={10} />
}

// alllll in one
export function Test11(props: any) {
  const lineHeight = 10
  return (
    <VStack
      height={props.scale * 31}
      borderRadius={8 * props.scale}
      borderWidth={1}
      borderColor={props.subtle ? 'transparent' : 'rgba(0,0,0,0.15)'}
      overflow="hidden"
      alignItems="center"
      position="relative"
      minHeight={lineHeight}
      {...props}
      backgroundColor="blue"
    />
  )
}
