/// <reference types="react" />
import { DishDialogProps } from './Dialog';
import { DialogProps } from 'tamagui';
export declare type ModalProps = DialogProps & DishDialogProps;
export declare const Modal: ({ open, defaultOpen, onOpenChange, modal, allowPinchZoom, children, ...rest }: ModalProps) => JSX.Element;
