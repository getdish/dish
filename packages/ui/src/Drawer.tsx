import BottomSheet, {
  BottomSheetModalProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { styled, themeable } from '@tamagui/core'
import { ScopedProps } from '@tamagui/create-context'
import { YStack } from '@tamagui/stacks'
import React, { ReactNode } from 'react'
import { withStaticProperties } from 'tamagui'

export const DrawerFrame = styled(YStack, {
  name: 'DrawerFrame',
  flex: 1,
  backgroundColor: '$background',
  borderTopLeftRadius: '$4',
  borderTopRightRadius: '$4',
  padding: '$4',
})

export type DrawerProps = ScopedProps<
  Omit<Partial<BottomSheetModalProps>, 'onChange' | 'backgroundStyle' | 'style'>,
  'Drawer'
> & {
  children?: ReactNode
  onIndexChange?: (next: number) => void
}

export const Drawer = withStaticProperties(
  themeable(
    (props) => {
      const {
        __scopeDrawer,
        children: childrenProp,
        onOpenChange,
        onIndexChange,
        ...rest
      } = props
      // const sheetRef = useRef<BottomSheet>(null)
      // useIsomorphicLayoutEffect(() => {
      //   if (!open) {
      //     // bugfix
      //     const tm = setTimeout(() => {
      //       sheetRef.current?.dismiss()
      //     })

      //     return () => {
      //       clearTimeout(tm)
      //     }
      //   } else {
      //     sheetRef.current?.present()
      //   }
      // }, [open])

      return (
        <BottomSheet
          // ref={sheetRef}
          snapPoints={['50%']}
          enablePanDownToClose
          index={0}
          // index={1}
          // onChange={(i) => {
          //   onIndexChange?.(i)
          // }}
          backgroundStyle={{
            backgroundColor: 'transparent',
          }}
          {...rest}
        >
          <BottomSheetView>{props.children}</BottomSheetView>
        </BottomSheet>
      )
    },
    {
      componentName: 'Drawer',
    }
  ),
  {
    ScrollView: BottomSheetScrollView,
  }
)
