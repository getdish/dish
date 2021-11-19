import { graphql, order_by, query } from '@dish/graph'
import { Paragraph, Text, XStack, YStack, useMedia } from '@dish/ui'
import React, { memo } from 'react'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { Image } from '../../views/Image'
import { TagButton } from '../../views/TagButton'

export const SearchPageResultsInfoBox = memo(({ state }: { state: HomeStateItemSearch }) => {
  const tags = getActiveTags(state)

  const dishTag = tags.find((x) => x.type === 'dish')
  if (dishTag) {
    return <HomeSearchInfoBoxDish state={state} />
  }

  const countryTag = tags.find((x) => x.type === 'country')
  if (countryTag) {
    return <HomeSearchInfoBoxCountry state={state} />
  }

  return null
})

const HomeSearchInfoBoxCountry = memo(
  graphql(({ state }: { state: HomeStateItemSearch }) => {
    const media = useMedia()
    const tags = getActiveTags(state)
    const countryTag = tags.find((x) => x.type === 'country')!
    const topCountryDishes = query.tag({
      order_by: [
        {
          popularity: order_by.desc,
        },
        {
          name: order_by.asc,
        },
      ],
      where: {
        type: {
          _eq: 'dish',
        },
        parent: {
          name: {
            _eq: countryTag.name,
          },
        },
      },
      limit: 30,
    })

    return (
      <XStack
        // borderColor="#eee"
        // borderWidth={1}
        borderRadius={100}
        overflow="hidden"
        marginHorizontal={10}
        marginBottom={10}
      >
        <ContentScrollViewHorizontal>
          <XStack paddingHorizontal={20} paddingVertical={5} spacing="xs" alignItems="center">
            <Paragraph
              width={media.sm ? 0 : 'auto'}
              overflow="hidden"
              opacity={0.7}
              fontSize={14}
              marginRight={8}
            >
              Popular dishes:
            </Paragraph>
            {topCountryDishes.map((tag, i) => {
              return (
                <TagButton
                  key={tag.id ?? i}
                  name={tag.name || ''}
                  icon={tag.icon || ''}
                  slug={tag.slug || ''}
                />
              )
            })}
          </XStack>
        </ContentScrollViewHorizontal>
      </XStack>
    )
  })
)

const HomeSearchInfoBoxDish = memo(({ state }: { state: HomeStateItemSearch }) => {
  const tags = getActiveTags(state)
  const dishTag = tags.find((x) => x.type === 'dish')

  return null
  if (!dishTag) {
    return null
  }

  return (
    <XStack
      paddingHorizontal={20}
      paddingRight={0}
      marginVertical={10}
      spacing={20}
      borderRadius={20}
      borderWidth={1}
      borderColor="#f2f2f2"
      paddingVertical={10}
      alignItems="center"
      maxWidth={620}
      alignSelf="center"
    >
      <YStack flex={1}>
        <Text fontSize={16} color="rgba(0,0,0,0.65)" lineHeight={24}>
          A rich, creamy soup with aromatics and shrimp paste, a classic Northern Thai dish with
          braised chicken in a coconut curry broth.
        </Text>
      </YStack>
      <YStack
        marginLeft={10}
        marginVertical={-20}
        marginRight={-10}
        position="relative"
        width={80}
        height={80}
      >
        <Image
          style={{
            width: 80,
            height: 80,
            borderRadius: 100,
          }}
          source={{
            uri: 'https://www.seriouseats.com/recipes/images/2014/09/20140707-small-house-thai-cooking-school-khao-soi-10.jpg',
          }}
        />
        <Text bottom={-5} left={-15} position="absolute" fontSize={42}>
          🍜
        </Text>
      </YStack>
    </XStack>
  )
})
