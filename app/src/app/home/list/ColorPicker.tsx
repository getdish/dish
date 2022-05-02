import { Card, Popover, YStack, YStackProps } from '@dish/ui'
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
    <Popover open={isOpen}>
      <Popover.Trigger onPress={() => setIsOpen((x) => !x)}>
        <ColorBubble backgroundColor={color} />
      </Popover.Trigger>
      {/* TODO aschild test */}
      <Popover.Content>
        <Card
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
        </Card>
      </Popover.Content>
    </Popover>
  )
}

function ColorBubble(props: YStackProps) {
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
