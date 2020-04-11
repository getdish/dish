import React, { useEffect, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { useDebounceValue } from '../../hooks/useDebounce'
import { HomeStateItemSimple } from '../../state/home'
import { useOvermind } from '../../state/om'
import { ForceShowPopover } from '../shared/Popover'
import { ZStack } from '../shared/Stacks'

export function HomeStackView<A extends HomeStateItemSimple>(props: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const debounceItems = useDebounceValue(props.items, transitionDuration)
  const isRemoving = debounceItems.length > props.items.length
  const items = isRemoving ? debounceItems : props.items
  return (
    <ZStack fullscreen>
      {items.map((item, index) => {
        const isActive = index === items.length - 1
        return (
          <ForceShowPopover.Provider
            key={`${index}`}
            value={isActive == true ? undefined : false}
          >
            <HomeStackViewItem
              item={item}
              index={index}
              isActive={isActive}
              isRemoving={isActive && isRemoving}
            >
              {props.children(item as any, isActive, index)}
            </HomeStackViewItem>
          </ForceShowPopover.Provider>
        )
      })}
    </ZStack>
  )
}

const transitionDuration = 280

function HomeStackViewItem({
  children,
  item,
  index,
  isActive,
  isRemoving,
}: {
  children: React.ReactNode
  item: HomeStateItemSimple
  index: number
  isActive: boolean
  isRemoving: boolean
}) {
  const om = useOvermind()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    let tm = setTimeout(() => {
      setIsMounted(true)
    }, 50)
    return () => clearTimeout(tm)
  }, [])
  const onPress = useMemo(
    () => () => {
      om.actions.home.popTo(item as any)
    },
    []
  )

  return (
    <div className={`animate-up ${isMounted && !isRemoving ? 'active' : ''}`}>
      <ZStack pointerEvents={isActive ? 'none' : 'auto'} fullscreen>
        <TouchableOpacity
          disabled={isActive}
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={onPress}
        >
          <ZStack
            backgroundColor={index === 0 ? 'transparent' : 'white'}
            flex={1}
            zIndex={index}
            top={index * 15}
            left={index * 10}
            bottom={-(index * 5)}
            width="100%"
            {...(index !== 0 && {
              shadowColor: 'rgba(0,0,0,0.15)',
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 3 },
            })}
            borderRadius={drawerBorderRadius}
            pointerEvents="auto"
            overflow="hidden"
          >
            {children}
          </ZStack>
        </TouchableOpacity>
      </ZStack>
    </div>
  )
}
