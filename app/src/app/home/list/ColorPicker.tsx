import React, { useState } from 'react'
import { Box, Popover, StackProps, VStack } from 'snackui'

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
          <VStack {...props} onPress={() => setIsOpen((x) => !x)}>
            <ColorBubble backgroundColor={color} />
          </VStack>
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
    <VStack
      borderWidth={2}
      borderColor="#000"
      borderRadius={1000}
      width={34}
      height={34}
      {...props}
    />
  )
}
