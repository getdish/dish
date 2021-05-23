import { StackProps, VStack } from 'snackui'

export function ScalingPressable(props: StackProps) {
  return (
    <VStack
      className="ease-in-out-faster"
      position="relative"
      zIndex={0}
      hoverStyle={{
        transform: [{ scale: 1.02 }],
        zIndex: 3,
      }}
      pressStyle={{
        transform: [{ scale: 0.975 }],
      }}
      {...props}
    />
  )
}
