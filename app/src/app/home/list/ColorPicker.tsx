import { Box, Popover, StackProps, YStack } from '@dish/ui'
import React, { useState } from 'react'

export function ColorPicker({
  colors,
  color,
  onChange,
}: {
  colors: string[]
  color: string
  onChange: (next: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      isOpen={isOpen}
      onChangeOpen={setIsOpen}
      trigger={(props) => {
        return (
          <YStack {...props} onPress={() => setIsOpen((x) => !x)}>
            <ColorBubble backgroundColor={color} />
          </YStack>
        )
      }}
    >
      <Box
        flexDirection="row"
        padding={20}
        maxWidth={130}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {colors.map((color) => {
          return (
            <ColorBubble
              key={color}
              marginBottom={10}
              backgroundColor={color}
              onPress={() => {
                onChange(color)
                setIsOpen(false)
              }}
            />
          )
        })}
      </Box>
    </Popover>
  )
}

function ColorBubble(props: StackProps) {
  return (
    <YStack
      borderWidth={2}
      borderColor="#000"
      borderRadius={1000}
      width={34}
      height={34}
      {...props}
    />
  )
}
