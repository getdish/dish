import { graphql, query, resolved, useLazyQuery } from '@dish/graph'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { Input, VStack, useTheme } from 'snackui'

import { AutocompleteItemRestuarant } from '../../../helpers/createAutocomplete'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { AutocompleteItemView } from '../../AppAutocomplete'
import { SlantedTitle } from '../../views/SlantedTitle'

export const ListAddRestuarant = graphql(
  ({
    onAdd,
    listSlug,
  }: {
    onAdd: (r: AutocompleteItemRestuarant & { id: string }) => any
    listSlug: string
  }) => {
    const theme = useTheme()
    const [results, setResults] = useState<AutocompleteItemRestuarant[]>([])

    let [runSearch, { isLoading }] = useLazyQuery(
      (_query, searchQuery: string) => {
        const restaurants = query.restaurant({
          where: {
            name: {
              _ilike: `%${searchQuery.split(' ').join('%')}%`,
            },
          },
          limit: 20,
        })
        return restaurants.map((restaurant) => {
          return {
            type: 'restaurant',
            name: restaurant.name,
            slug: restaurant.slug,
            description: restaurant.address,
            icon: restaurant.image,
          } as const
        })
      },
      {
        onCompleted: setResults,
      }
    )

    return (
      <VStack width="100%" height="100%" flex={1}>
        <SlantedTitle alignSelf="center" marginTop={-15}>
          Add
        </SlantedTitle>
        <VStack width="100%">
          <Input
            backgroundColor={theme.backgroundColorSecondary}
            marginHorizontal={20}
            placeholder="Search restaurants..."
            onChangeText={(val) => runSearch({ args: val })}
          />
        </VStack>
        <ScrollView style={{ width: '100%' }}>
          <VStack padding={20} spacing="xs">
            {results.map((result, index) => {
              return (
                <AutocompleteItemView
                  preventNavigate
                  key={result.slug ?? index}
                  hideBackground
                  onSelect={() => {}}
                  target="search"
                  showAddButton
                  index={index}
                  result={result}
                  onAdd={async () => {
                    const id = await resolved(
                      () => queryRestaurant(result.slug)[0].id
                    )
                    onAdd({
                      ...result,
                      id,
                    })
                  }}
                />
              )
            })}
          </VStack>
        </ScrollView>
      </VStack>
    )
  }
)
