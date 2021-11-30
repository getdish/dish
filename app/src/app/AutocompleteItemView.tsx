import { Spacer, Text, Theme, XStack, YStack, useDebounce, useTheme } from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import React, { memo } from 'react'
import { Keyboard } from 'react-native'

import { AutocompleteItem } from '../helpers/createAutocomplete'
import { AutocompleteSelectCb } from './AutocompleteResults'
import { ShowAutocomplete, autocompletesStore } from './AutocompletesStore'
import { CircleButton } from './home/restaurant/CircleButton'
import { Image } from './views/Image'
import { LinkButton } from './views/LinkButton'

export const AutocompleteItemView = memo(
  ({
    target,
    onSelect,
    result,
    showAddButton,
    onAdd,
    hideBackground,
    isAdded,
    preventNavigate,
    hideIcon,
    isActive,
    index,
  }: {
    result: AutocompleteItem
    index: number
    target: ShowAutocomplete
    preventNavigate?: boolean
    showAddButton?: boolean
    onSelect: AutocompleteSelectCb
    hideBackground?: boolean
    onAdd?: () => any
    isAdded?: boolean
    isActive?: boolean
    hideIcon?: boolean
  }) => {
    const showLocation = target === 'location'
    const theme = useTheme()
    const hideAutocompleteSlow = useDebounce(() => autocompletesStore.setVisible(false), 50)
    const plusButtonEl = showAddButton ? (
      <>
        <YStack flex={1} />
        <YStack padding={3} flexShrink={0}>
          {/* @ts-expect-error */}
          <Theme name={isAdded ? 'active' : null}>
            <CircleButton onPress={onAdd}>
              <Plus color={isAdded ? '#fff' : theme.color4.toString()} size={16} />
            </CircleButton>
          </Theme>
        </YStack>
      </>
    ) : null

    const icon =
      result.icon?.indexOf('http') === 0 ? (
        <Image
          source={{ uri: result.icon }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 100,
          }}
        />
      ) : result.icon ? (
        <Text fontSize={28}>{result.icon} </Text>
      ) : null

    return (
      // @ts-expect-error
      <LinkButton
        alignSelf="stretch"
        justifyContent="flex-start"
        minHeight={46}
        backgroundColor={isActive ? '#000' : 'transparent'}
        borderRadius={0}
        hoverStyle={{
          backgroundColor: isActive ? '#000' : theme.bgDark,
        }}
        {...(hideBackground && {
          backgroundColor: 'transparent',
          hoverStyle: {
            backgroundColor: 'transparent',
          },
        })}
        onPressOut={() => {
          Keyboard.dismiss()
          hideAutocompleteSlow()
          onSelect(result, index)
        }}
        stopPropagation
        preventNavigate={preventNavigate}
        {...getLinkForAutocomplete(result)}
        noTextWrap
      >
        <XStack alignItems="center" width="100%">
          <YStack overflow="hidden" flex={1}>
            <XStack width="100%" marginVertical={-3} flex={1} alignItems="center">
              <Text fontWeight="600" ellipse color={theme.color} fontSize={18} lineHeight={30}>
                {!!result.namePrefix && (
                  <>
                    <Text fontWeight="300">{result.namePrefix}</Text>{' '}
                  </>
                )}
                {result.name}
              </Text>
            </XStack>
            {!!result.description && (
              <>
                <Spacer size="$1" />
                <Text ellipse color={theme.color2} fontSize={15}>
                  {result.description}
                </Text>
              </>
            )}
          </YStack>
          {!hideIcon && (
            <>
              <YStack flex={1} />
              {icon}
            </>
          )}
          {plusButtonEl}
        </XStack>
      </LinkButton>
    )
  }
)

function getLinkForAutocomplete(item: AutocompleteItem) {
  if (item.type == 'user') {
    return {
      name: 'user',
      params: {
        username: item.slug,
      },
    } as const
  }
  if (item.type == 'restaurant') {
    return {
      name: 'restaurant',
      params: {
        slug: item.slug,
      },
    } as const
  }
  if (item?.type !== 'orphan') {
    return {
      tag: item,
    } as const
  }
  return null
}
