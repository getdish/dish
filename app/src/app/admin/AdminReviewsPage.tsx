import { graphql, order_by, query } from '@dish/graph'
import { fetchBertSentiment } from '@dish/helpers'
import { Separator, Text, XStack, YStack, useDebounceValue } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, useEffect, useState } from 'react'
import { ScrollView, TextInput } from 'react-native'

import { green100, red100 } from '../../constants/colors'
import { defaultLocationAutocompleteResults } from '../../constants/defaultLocationAutocompleteResults'
import { AutocompleteItem } from '../../helpers/createAutocomplete'
import { locationToAutocomplete, searchLocations } from '../../helpers/searchLocations'
import { SmallTitle } from '../views/SmallTitle'
import { AdminListItem } from './AdminListItem'
import { AdminSearchableColumn } from './AdminSearchableColumn'
import { VerticalColumn } from './VerticalColumn'

export class AdminReviewsStore extends Store {
  selectedCity: AutocompleteItem | null = null
  selectedRestaurantId = ''
  selectedReviewId = ''

  setSelectedRestaurantId(val: string) {
    this.selectedRestaurantId = val
  }

  setSelectedReviewId(val: string) {
    this.selectedReviewId = val
  }

  setSelectedCity(val: AutocompleteItem | null) {
    this.selectedCity = val
  }
}

export default graphql(() => {
  return (
    <YStack flex={1} overflow="hidden" width="100%">
      <XStack overflow="hidden" width="100%" flex={1}>
        <ScrollView horizontal>
          <XStack>
            <VerticalColumn>
              <PlacesList />
            </VerticalColumn>
            <VerticalColumn>
              <RestaurantList />
            </VerticalColumn>
            <VerticalColumn>
              <ReviewList />
            </VerticalColumn>
            <VerticalColumn width={400} maxWidth={400} padding={20}>
              <ReviewDisplay />
            </VerticalColumn>
          </XStack>
        </ScrollView>

        {/* <VerticalColumn>
          <Suspense fallback={<LoadingItems />}>
            <TagEditColumn />
          </Suspense>
        </VerticalColumn> */}
      </XStack>
    </YStack>
  )
})

const ReviewDisplay = graphql(() => {
  const adminStore = useStore(AdminReviewsStore)
  const [review] = adminStore.selectedReviewId
    ? query.review({
        where: {
          id: {
            _eq: adminStore.selectedReviewId,
          },
        },
      })
    : []

  return (
    <>
      {!review && <Text>No Review Selected</Text>}
      {!!review && (
        <ScrollView>
          <YStack spacing={10}>
            <Text>rating: {review.rating}</Text>
            <Text>username: {review.username}</Text>
            <Text>text: {review.text}</Text>

            <Separator />

            <ReviewSentiment key={review.text} text={review.text ?? ''} />
          </YStack>
        </ScrollView>
      )}
    </>
  )
})

const ReviewSentiment = (props: { text: string }) => {
  const [aspect, setAspect] = useState('')
  const aspectSlow = useDebounceValue(aspect, 500)
  const [sentiments, setSentiments] = useState([])

  useEffect(() => {
    if (!aspectSlow) return
    const sentences = props.text.split('. ')
    if (sentences.length) {
      Promise.all([
        fetchBertSentiment(props.text).then((response) => {
          return {
            sentiment: response.positive,
            sentence: `(Entire Text - ${aspect})`,
          }
        }),
        ...sentences
          .filter((x) => x.toLowerCase().includes(aspect))
          .map((sentence) => {
            return fetchBertSentiment(sentence).then((response) => {
              return {
                sentiment: response.positive,
                sentence: sentence,
              }
            })
          }),
      ]).then((sentiments) => {
        console.log(sentiments)
        setSentiments(sentiments as any)
      })
    }
  }, [aspectSlow])

  return (
    <YStack spacing="lg">
      <SmallTitle>Sentiment</SmallTitle>

      <TextInput style={{ borderWidth: 1, padding: 5 }} onChangeText={(text) => setAspect(text)} />

      <Separator />

      {sentiments.map(({ sentiment, sentence }) => {
        return (
          <Text backgroundColor={sentiment === 'Negative' ? red100 : green100} key={sentence}>
            {sentence} <strong>({sentiment})</strong>.
          </Text>
        )
      })}
    </YStack>
  )
}

const PlacesList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Places" onChangeSearch={(x) => setSearch(x)}>
      <PlacesListContent column={0} search={search} />
    </AdminSearchableColumn>
  )
}

const defaultPlaces: AutocompleteItem[] = [
  {
    name: 'All',
    type: 'orphan',
  },
  ...defaultLocationAutocompleteResults,
]

const PlacesListContent = graphql(({ search, column }: { search: string; column: number }) => {
  const adminStore = useStore(AdminReviewsStore)
  const [results, setResults] = useState<AutocompleteItem[]>(defaultPlaces)

  useEffect(() => {
    let cancelled = false
    searchLocations(search).then((locations) => {
      if (!cancelled) {
        setResults([...defaultPlaces, ...locations.map(locationToAutocomplete)])
      }
    })
    return () => {
      cancelled = true
    }
  }, [search])

  return (
    <ScrollView style={{ paddingBottom: 100 }}>
      {results.map((item, row) => {
        return (
          <AdminListItem
            key={item.name + row}
            text={item.name ?? 'no name'}
            id="reviews"
            row={row}
            column={column}
            onSelect={() => {
              if (item.type === 'orphan') {
                adminStore.setSelectedCity(null)
              } else {
                adminStore.setSelectedCity(item)
              }
            }}
          />
        )
      })}
    </ScrollView>
  )
})

const RestaurantList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Restaurants" onChangeSearch={(x) => setSearch(x)}>
      <RestaurantsListContent column={1} search={search} />
    </AdminSearchableColumn>
  )
}

const RestaurantsListContent = graphql(({ search, column }: { search: string; column: number }) => {
  const adminStore = useStore(AdminReviewsStore)
  const { selectedCity } = adminStore
  const limit = 200
  const [page, setPage] = useState(1)
  const results = query.restaurant({
    where: {
      name: {
        ...(!!search && {
          _ilike: `%${search}%`,
        }),
        _neq: '',
      },
      ...(selectedCity &&
        'center' in selectedCity && {
          location: {
            _st_d_within: {
              // search outside current bounds a bit
              distance: 1,
              from: {
                type: 'Point',
                coordinates: [selectedCity.center?.lng, selectedCity.center?.lat],
              },
            },
          },
        }),
    },
    limit: limit,
    offset: (page - 1) * limit,
    order_by: [
      {
        name: order_by.asc,
      },
    ],
  })

  return (
    <ScrollView style={{ paddingBottom: 100 }}>
      {results.map((item, index) => {
        return (
          <AdminListItem
            key={item.id}
            text={item.name ?? 'no name'}
            id="reviews"
            row={index}
            column={column}
            onSelect={() => {
              adminStore.setSelectedRestaurantId(item.id)
            }}
          />
        )
      })}

      {results.length === limit && (
        <XStack
          height={32}
          padding={6}
          hoverStyle={{
            backgroundColor: '#f2f2f2',
          }}
          onPress={() => {
            setPage((x) => x + 1)
          }}
        >
          <Text>Next page</Text>
        </XStack>
      )}
    </ScrollView>
  )
})

const ReviewList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Reviews" onChangeSearch={(x) => setSearch(x)}>
      {/* <Suspense fallback="Loading...xd"> */}
      <ReviewListContent search={search} column={2} />
      {/* </Suspense> */}
    </AdminSearchableColumn>
  )
}

const ReviewListContent = graphql(({ search, column }: { search: string; column: number }) => {
  const adminStore = useStore(AdminReviewsStore)
  const limit = 200
  const [page, setPage] = useState(1)
  const results = query.review({
    where: {
      ...(!!adminStore.selectedRestaurantId && {
        restaurant_id: {
          _eq: adminStore.selectedRestaurantId,
        },
      }),
      ...(!!search && {
        text: {
          _ilike: `%${search}%`,
          _neq: '',
        },
      }),
    },
    limit: limit,
    offset: (page - 1) * limit,
    order_by: [
      {
        id: order_by.asc,
      },
    ],
  })

  return (
    <ScrollView style={{ paddingBottom: 100 }}>
      {results.map((item, row) => {
        return (
          <AdminListItem
            key={item.id}
            text={`${item.user.username ?? 'no name'} - ${item.text?.slice(0, 100)}`}
            id="reviews"
            row={row}
            column={column}
            onSelect={() => {
              adminStore.setSelectedReviewId(item.id)
            }}
          />
        )
      })}

      {results.length === limit && (
        <XStack
          height={32}
          padding={6}
          hoverStyle={{
            backgroundColor: '#f2f2f2',
          }}
          onPress={() => {
            setPage((x) => x + 1)
          }}
        >
          <Text>Next page</Text>
        </XStack>
      )}
    </ScrollView>
  )
})
