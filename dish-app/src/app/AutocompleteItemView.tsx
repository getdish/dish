import { Plus } from '@dish/react-feather'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { HStack, Spacer, Text, VStack, useDebounce, useTheme } from 'snackui'

import { AutocompleteItem } from '../helpers/createAutocomplete'
import { AutocompleteSelectCb } from './AutocompleteFrame'
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
    preventNavigate,
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
  }) => {
    const showLocation = target === 'location'
    const theme = useTheme()
    const hideAutocompleteSlow = useDebounce(() => autocompletesStore.setVisible(false), 50)
    const plusButtonEl = showAddButton ? (
      <>
        <VStack flex={1} />
        <VStack padding={8} flexShrink={0}>
          <CircleButton onPressOut={onAdd}>
            <Plus size={16} />
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
        <Text fontSize={32}>{result.icon} </Text>
      ) : null

    return (
      <LinkButton
        width="100%"
        justifyContent={target === 'location' ? 'flex-end' : 'flex-start'}
        minHeight={58}
        backgroundColor={isActive ? theme.backgroundColor : 'transparent'}
        hoverStyle={{
          backgroundColor: theme.backgroundColorTertiary,
        }}
        onPressOut={() => {
          hideAutocompleteSlow()
          onSelect(result, index)
        }}
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
      >
        <HStack width="100%">
          <VStack flex={1}>
            <HStack marginVertical={-3} flex={1} alignItems="center">
              {icon}
              {!!icon && <Spacer size="lg" />}
              <Text fontWeight="700" ellipse color={theme.color} fontSize={24} lineHeight={28}>
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
          {plusButtonEl}
        </HStack>
      </LinkButton>
    )
  }
)
