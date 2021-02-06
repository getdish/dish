import { VStack } from 'snackui'

export function ScalingPressable({ children }: { children: any }) {
  return (
    <VStack
      className="ease-in-out-faster"
      position="relative"
      zIndex={0}
      hoverStyle={{
        transform: [{ scale: 1.025 }],
        zIndex: 3,
      }}
      pressStyle={{
        transform: [{ scale: 0.95 }],
      }}
    >
      {children}
    </VStack>
  )
}
