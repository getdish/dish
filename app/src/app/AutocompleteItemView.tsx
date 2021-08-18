import { Plus } from '@dish/react-feather'
import React, { memo } from 'react'
import { Image, Keyboard } from 'react-native'
import { HStack, Spacer, Text, VStack, useDebounce, useTheme } from 'snackui'

import { AutocompleteItem } from '../helpers/createAutocomplete'
import { rgbString } from '../helpers/rgb'
import { AutocompleteSelectCb } from './AutocompleteResults'
import { ShowAutocomplete, autocompletesStore } from './AutocompletesStore'
import { CircleButton } from './home/restaurant/CircleButton'
import { useCurrentLenseColor } from './hooks/useCurrentLenseColor'
import { LinkButton } from './views/LinkButton'

export const AutocompleteItemView = memo(
  ({
    target,
    onSelect,
    result,
    showAddButton,
    onAdd,
    hideBackground,
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
    isActive?: boolean
    hideIcon?: boolean
  }) => {
    const showLocation = target === 'location'
    const theme = useTheme()
    const themeColor = rgbString(useCurrentLenseColor().rgb)
    const hideAutocompleteSlow = useDebounce(() => autocompletesStore.setVisible(false), 50)
    const plusButtonEl = showAddButton ? (
      <>
        <VStack flex={1} />
        <VStack padding={8} flexShrink={0}>
          <CircleButton onPress={onAdd}>
            <Plus color="#777" size={16} />
          </CircleButton>
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
        backgroundColor={isActive ? themeColor : 'transparent'}
        borderRadius={0}
        hoverStyle={{
          backgroundColor: isActive ? themeColor : theme.backgroundColorDarker,
        }}
        onPressOut={() => {
          Keyboard.dismiss()
          hideAutocompleteSlow()
          onSelect(result, index)
        }}
        stopPropagation
        preventNavigate={preventNavigate}
        {...(!showLocation &&
          result?.type !== 'orphan' && {
            tag: result,
          })}
        {...(result.type == 'restaurant' && {
          tag: null,
          name: 'restaurant',
          params: {
            slug: result.slug,
          },
        })}
        noTextWrap
      >
        <HStack alignItems="center" width="100%">
          <VStack overflow="hidden" flex={1}>
            <HStack width="100%" marginVertical={-3} flex={1} alignItems="center">
              <Text fontWeight="700" ellipse color={theme.color} fontSize={20} lineHeight={30}>
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
