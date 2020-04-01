import React, { Children, useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import Hoverable from '../shared/Hoverable'
import { HStack, StackBaseProps, VStack } from '../shared/Stacks'

export const HoverableButton = ({
  onPress,
  isHovered,
  spacing,
  children,
  ...props
}: StackBaseProps & {
  onPress: any
  isHovered?: boolean
}) => {
  const [isHoveredInt, setIsHovered] = useState(false)
  const isHoveredFinal = isHovered || isHoveredInt
  return (
    <TouchableOpacity onPress={onPress}>
      <Hoverable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <div
          className="see-through"
          style={{
            filter: `grayscale(${isHoveredFinal ? 0 : 100}%)`,
          }}
        >
          <Text>
            <HStack
              alignItems="center"
              opacity={isHoveredFinal ? 1 : 0.5}
              spacing={spacing ?? 'sm'}
              {...props}
            >
              {React.Children.toArray(children).map((child, index) =>
                typeof child == 'string' ? (
                  <Text key={index}>{child}</Text>
                ) : (
                  <React.Fragment key={index}>{child}</React.Fragment>
                )
              )}
            </HStack>
          </Text>
        </div>
      </Hoverable>
    </TouchableOpacity>
  )
}
