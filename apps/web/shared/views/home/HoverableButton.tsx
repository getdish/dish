import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'

import Hoverable from '../shared/Hoverable'
import { StackBaseProps, VStack } from '../shared/Stacks'

export const HoverableButton = ({
  onPress,
  isHovered,
  ...props
}: StackBaseProps & {
  onPress: any
  isHovered?: boolean
}) => {
  const [isHoveredInt, setIsHovered] = useState(false)
  const isHoveredFinal = isHovered || isHoveredInt
  return (
    <TouchableOpacity onPress={onPress}>
      <VStack opacity={isHoveredFinal ? 1 : 0.5} {...props}>
        <Hoverable
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
        >
          <div
            style={{
              filter: `grayscale(${isHoveredFinal ? 0 : 100}%)`,
            }}
          >
            {props.children}
          </div>
        </Hoverable>
      </VStack>
    </TouchableOpacity>
  )
}
