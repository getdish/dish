import { DishDialog } from './Dialog';
import React from 'react';
import { Dialog } from 'tamagui';
export const Modal = ({ open, defaultOpen, onOpenChange, modal = true, allowPinchZoom, children, ...rest }) => {
    return (<Dialog {...{
        open,
        defaultOpen,
        onOpenChange,
        modal,
    }}>
      <DishDialog {...rest}>{children}</DishDialog>
    </Dialog>);
};
