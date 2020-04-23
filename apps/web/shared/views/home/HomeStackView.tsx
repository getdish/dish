import React, { useEffect, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { useDebounceValue } from '../../hooks/useDebounce'
import { useMedia } from '../../hooks/useMedia'
import { HomeStateItemSimple } from '../../state/home'
import { useOvermindStatic } from '../../state/om'
import { ErrorBoundary } from '../ErrorBoundary'
import { ForceShowPopover } from '../ui/Popover'
import { ZStack } from '../ui/Stacks'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

export function HomeStackView<A extends HomeStateItemSimple>(props: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const om = useOvermindStatic()
  const allStates = om.state.home.states
  const debounceItems = useDebounceValue(props.items, transitionDuration)
  const isRemoving = debounceItems.length > props.items.length
  const items = isRemoving ? debounceItems : props.items
  return (
    <ZStack fullscreen>
      {items.map((item, i) => {
        const isActive = i === items.length - 1
        const stackItemIndex = allStates.findIndex((x) => x.id === item.id)
        return (
          <ForceShowPopover.Provider
            key={`${i}`}
            value={isActive == true ? undefined : false}
          >
            <HomeStackViewItem
              item={item}
              index={i}
              isActive={isActive}
              isRemoving={isActive && isRemoving}
            >
              <ErrorBoundary name={`${item.type}`}>
                {props.children(item as any, isActive, stackItemIndex)}
              </ErrorBoundary>
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
  const om = useOvermindStatic()
  const [isMounted, setIsMounted] = useState(false)
  const isSmall = useMediaQueryIsSmall()

  useEffect(() => {
    let tm = setTimeout(() => {
      setIsMounted(true)
    }, 50)
    return () => clearTimeout(tm)
  }, [])
  const onPress = useMemo(
    () => () => {
      om.actions.home.popTo(item.type)
    },
    []
  )

  const top = isSmall ? 0 : (index - 1) * 10 + 6
  const left = isSmall ? -3 : index * 10

  return (
    <div
      className={`animate-right ${isMounted && !isRemoving ? 'active' : ''}`}
    >
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
            top={top}
            left={left}
            bottom={-(index * 5)}
            width="100%"
            {...(index !== 0 && {
              shadowColor: 'rgba(0,0,0,0.1)',
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
