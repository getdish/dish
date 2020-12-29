import { graphql, order_by, query } from '@dish/graph'
import { fetchBertSentiment } from '@dish/helpers'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, useEffect, useState } from 'react'
import { ScrollView, TextInput } from 'react-native'
import {
  Divider,
  HStack,
  SmallTitle,
  Text,
  VStack,
  useDebounceValue,
} from 'snackui'

import { lightGreen, lightRed } from '../../constants/colors'
import {
  locationToAutocomplete,
  searchLocations,
} from '../../helpers/searchLocations'
import { defaultLocationAutocompleteResults } from '../../constants/defaultLocationAutocompleteResults'
import { AdminListItem } from './AdminListItem'
import { AdminSearchableColumn } from './AdminSearchableColumn'
import { VerticalColumn } from './VerticalColumn'
import {AutocompleteItem} from "../../helpers/createAutocomplete";

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

  setSelectedCity(val: AutocompleteItem) {
    this.selectedCity = val
  }
}

export default graphql(() => {
  return (
    <VStack flex={1} overflow="hidden" width="100%">
      <HStack overflow="hidden" width="100%" flex={1}>
        <ScrollView horizontal>
          <HStack>
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
          </HStack>
        </ScrollView>

        {/* <VerticalColumn>
          <Suspense fallback={<LoadingItems />}>
            <TagEditColumn />
          </Suspense>
        </VerticalColumn> */}
      </HStack>
    </VStack>
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
          <VStack spacing={10}>
            <Text>rating: {review.rating}</Text>
            <Text>username: {review.username}</Text>
            <Text>text: {review.text}</Text>

            <Divider />

            <ReviewSentiment key={review.text} text={review.text ?? ''} />
          </VStack>
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
            sentiment: response.result[0][0] + ' ' + response.result[0][1],
            sentence: `(Entire Text - ${aspect})`,
          }
        }),
        ...sentences
          .filter((x) => x.toLowerCase().includes(aspect))
          .map((sentence) => {
            return fetchBertSentiment(sentence).then((response) => {
              return {
                sentiment: response.result[0][0] + ' ' + response.result[0][1],
                sentence: sentence,
              }
            })
          }),
      ]).then((sentiments) => {
        console.log(sentiments)
        setSentiments(sentiments)
      })
    }
  }, [aspectSlow])

  return (
    <VStack spacing="lg">
      <SmallTitle>Sentiment</SmallTitle>

      <TextInput
        style={{ borderWidth: 1, padding: 5 }}
        onChangeText={(text) => setAspect(text)}
      />

      <Divider />

      {sentiments.map(({ sentiment, sentence }) => {
        return (
          <Text
            backgroundColor={sentiment === 'Negative' ? lightRed : lightGreen}
            key={sentence}
          >
            {sentence} <strong>({sentiment})</strong>.
          </Text>
        )
      })}
    </VStack>
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
    is: 'autocomplete',
    name: 'All',
    type: 'all',
  },
  ...defaultLocationAutocompleteResults,
]

const PlacesListContent = graphql(
  ({ search, column }: { search: string; column: number }) => {
    const adminStore = useStore(AdminReviewsStore)
    const [results, setResults] = useState<AutocompleteItem[]>(defaultPlaces)

    useEffect(() => {
      let cancelled = false
      searchLocations(search).then((locations) => {
        if (!cancelled) {
          setResults([
            ...defaultPlaces,
            ...locations.map(locationToAutocomplete),
          ])
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
                if (item.type === 'all') {
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
  }
)

const RestaurantList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn
      title="Restaurants"
      onChangeSearch={(x) => setSearch(x)}
    >
      <RestaurantsListContent column={1} search={search} />
    </AdminSearchableColumn>
  )
}

const RestaurantsListContent = graphql(
  ({ search, column }: { search: string; column: number }) => {
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
        ...(selectedCity && {
          location: {
            _st_d_within: {
              // search outside current bounds a bit
              distance: 1,
              from: {
                type: 'Point',
                coordinates: [selectedCity.center.lng, selectedCity.center.lat],
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
          <HStack
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
          </HStack>
        )}
      </ScrollView>
    )
  }
)

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

const ReviewListContent = graphql(
  ({ search, column }: { search: string; column: number }) => {
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
              text={`${item.user.username ?? 'no name'} - ${item.text?.slice(
                0,
                100
              )}`}
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
          <HStack
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
          </HStack>
        )}
      </ScrollView>
    )
  }
)
