import { Input, InputProps } from '@o/ui'
import React, { forwardRef, useCallback } from 'react'

// TODO: replace into ui kit

export const SearchInput = (props: InputProps) => (
  <Input
    sizeRadius={10}
    size="lg"
    iconSize={16}
    flex={1}
    icon="search"
    placeholder="Search..."
    boxShadow={[[0, 5, 8, [0, 0, 0, 0.05]]]}
    onKeyDown={useCallback((e) => {
      // avoid movement on down/up
      if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault()
      }
    }, [])}
    {...props}
  />
)
