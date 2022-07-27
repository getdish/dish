import { DishDialog, DishDialogProps } from './Dialog'
import React from 'react'
import { Dialog, DialogProps } from 'tamagui'

export type ModalProps = DialogProps & DishDialogProps

// simple controlled dialog
export const Modal = ({
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
  allowPinchZoom,
  children,
  ...rest
}: ModalProps) => {
  return (
    <Dialog
      {...{
        open,
        defaultOpen,
        onOpenChange,
        modal,
      }}
    >
      <DishDialog {...rest}>{children}</DishDialog>
    </Dialog>
  )
}
