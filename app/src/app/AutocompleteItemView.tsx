import { Plus } from '@dish/react-feather'
import React, { memo } from 'react'
import { Image, Keyboard } from 'react-native'
import { HStack, Spacer, Text, Theme, VStack, useDebounce, useTheme } from 'snackui'

import { AutocompleteItem } from '../helpers/createAutocomplete'
import { AutocompleteSelectCb } from './AutocompleteResults'
import { ShowAutocomplete, autocompletesStore } from './AutocompletesStore'
import { CircleButton } from './home/restaurant/CircleButton'
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
        <VStack flex={1} />
        <VStack padding={3} flexShrink={0}>
          <Theme name={isAdded ? 'active' : null}>
            <CircleButton onPress={onAdd}>
              <Plus color={isAdded ? '#fff' : theme.colorQuartenary} size={16} />
            </CircleButton>
          </Theme>
        </VStack>
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
      <LinkButton
        alignSelf="stretch"
        justifyContent="flex-start"
        minHeight={46}
        backgroundColor={isActive ? '#000' : 'transparent'}
        borderRadius={0}
        hoverStyle={{
          backgroundColor: isActive ? '#000' : theme.backgroundColorDarker,
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
        <HStack alignItems="center" width="100%">
          <VStack overflow="hidden" flex={1}>
            <HStack width="100%" marginVertical={-3} flex={1} alignItems="center">
              <Text fontWeight="600" ellipse color={theme.color} fontSize={18} lineHeight={30}>
                {!!result.namePrefix && (
                  <>
                    <Text fontWeight="300">{result.namePrefix}</Text>{' '}
                  </>
                )}
                {result.name}
              </Text>
            </HStack>
            {!!result.description && (
              <>
                <Spacer size="xs" />
                <Text ellipse color={theme.colorSecondary} fontSize={15}>
                  {result.description}
                </Text>
              </>
            )}
          </VStack>
          {!hideIcon && (
            <>
              <VStack flex={1} />
              {icon}
            </>
          )}
          {plusButtonEl}
        </HStack>
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
