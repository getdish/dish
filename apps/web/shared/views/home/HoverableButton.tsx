import React, { Children, useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import Hoverable from '../shared/Hoverable'
import { HStack, StackBaseProps, VStack } from '../shared/Stacks'

export const HoverableButton = ({
  onPress,
  isHovered,
  spacing,
  children,
  opacity = 1,
  ...props
}: StackBaseProps & {
  onPress: any
  isHovered?: boolean
  onHoverIn?: Function
  onHoverOut?: Function
}) => {
  const [isHoveredInt, setIsHovered] = useState(false)
  const isHoveredFinal = isHovered || isHoveredInt
  return (
    <TouchableOpacity onPress={onPress}>
      <Hoverable
        onHoverIn={() => {
          setIsHovered(true)
          props.onHoverIn?.()
        }}
        onHoverOut={() => {
          setIsHovered(false)
          props.onHoverOut?.()
        }}
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
              opacity={isHoveredFinal ? 1 : opacity}
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
