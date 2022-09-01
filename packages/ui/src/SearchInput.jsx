import { forwardRef } from 'react';
import { Input } from 'tamagui';
export const SearchInput = forwardRef((props, ref) => (<Input componentName="SearchInput" flex={1} width="100%" borderRadius={0} backgroundColor="transparent" borderWidth={0} fontFamily="$body" size={'$7'} fontWeight="500" shadowOpacity={0} focusStyle={{
        borderWidth: 0,
        margin: 0,
    }} ref={ref} {...props}/>));
