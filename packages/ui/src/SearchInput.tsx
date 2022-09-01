/* eslint-disable react/react-in-jsx-scope */
import { forwardRef } from 'react'
import { Input, InputProps } from 'tamagui'

export const SearchInput = forwardRef((props: InputProps, ref) => (
  <Input
    componentName="SearchInput"
    flex={1}
    // this is necessary otherwise it flexes way past containers}
    width="100%"
    borderRadius={0}
    backgroundColor="transparent"
    borderWidth={0}
    fontFamily="$body"
    size={'$7'}
    // fontFamily: '$stylish',
    // fontSize: 62,
    // lineHeight: 62,
    // height: 82}
    fontWeight="500"
    shadowOpacity={0}
    focusStyle={{
      borderWidth: 0,
      margin: 0,
    }}
    ref={ref as any}
    {...props}
  />
))
