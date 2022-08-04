import { AutocompleteItem } from '../helpers/createAutocomplete'
import { AutocompleteSelectCb } from './AutocompleteResults'
import { ShowAutocomplete, autocompletesStore } from './AutocompletesStore'
import { CircleButton } from './home/restaurant/CircleButton'
import { Image } from './views/Image'
import { LinkButton } from './views/LinkButton'
import {
  ListItem,
  SizableText,
  Spacer,
  Text,
  Theme,
  XStack,
  YStack,
  useDebounce,
  useTheme,
} from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import React, { memo } from 'react'
import { Keyboard } from 'react-native'

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
    // const showLocation = target === 'location'
    const theme = useTheme()
    const hideAutocompleteSlow = useDebounce(() => autocompletesStore.setVisible(false), 50)
    const plusButtonEl = showAddButton ? (
      <>
        <YStack flex={1} />
        <YStack padding={3} flexShrink={0}>
          <Theme name={isAdded ? 'active' : null}>
            <CircleButton onPress={onAdd}>
              <Plus color={isAdded ? '#fff' : theme.colorFocus.toString()} size={16} />
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
        asChild
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
        <ListItem
          size="$6"
          title={result.name}
          subTitle={result.description}
          icon={<XStack w={40}>{icon}</XStack>}
          hoverTheme
          // backgroundColor="$background"
        >
          {plusButtonEl}
        </ListItem>
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
