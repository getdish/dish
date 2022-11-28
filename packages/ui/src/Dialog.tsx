import { X } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Dialog, DialogContentProps, Unspaced, withStaticProperties } from 'tamagui'

export type DishDialogProps = DialogContentProps & { closable?: boolean }

export const DishDialog = withStaticProperties(Dialog, {
  Content: ({ closable, children, ...props }: DishDialogProps) => (
    <Dialog.Portal>
      <Dialog.Overlay
        key="overlay"
        animation="quick"
        o={0.5}
        enterStyle={{ o: 0 }}
        exitStyle={{ o: 0 }}
      />
      <Dialog.Content
        bordered
        elevate
        key="content"
        space
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        x={0}
        scale={1}
        opacity={1}
        y={0}
        {...props}
      >
        {children}

        {!!closable && (
          <Unspaced>
            <Dialog.Close asChild>
              <Button pos="absolute" t="$4" r="$4" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  ),
})
