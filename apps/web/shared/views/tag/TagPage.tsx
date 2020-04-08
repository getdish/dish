import {
  FetchResult,
  gql,
  useApolloClient,
  useQuery,
  useSubscription,
} from '@apollo/client'
import { Tag, TagRecord, TagType } from '@dish/models'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native'

import { HStack, VStack } from '../shared/Stacks'
import Tappable from '../shared/Tappable'

const CONTINENTS_SUBSCRIPTION = gql`
subscription Tag {
  tag(where: { type: { _eq: "continent" } }, order_by: {order: asc}) {
    id ${Tag.fieldsQuery}
  }
}
`

const COUNTRIES_SUBSCRIPTION = gql`
subscription Tag($parentId: uuid!) {
  tag(where: { type: { _eq: "country" }, parentId: { _eq: $parentId }, parentType: { _eq: "continent" } }, order_by: {order: asc}) {
    id ${Tag.fieldsQuery}
  }
}
`

const DISHES_SUBSCRIPTION = gql`
subscription Tag($parentId: uuid!) {
  tag(where: { type: { _eq: "dish" }, parentId: { _eq: $parentId }, parentType: { _eq: "country" } }, order_by: {order: asc}) {
    id ${Tag.fieldsQuery}
  }
}
`

const TAXONOMY_DELETE = gql`
  mutation Delete($id: uuid!) {
    delete_tag(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

const DISHES_SEARCH = gql`
  query DishesSearch($limit: Int!, $search: String!) {
    dish(limit: $limit, where: { name: { _ilike: $search } }) {
      id
      name
    }
  }
`

const BorderLeft = () => <View />

const upsertTag = () => {
  const apolloClient = useApolloClient()
  const [draft, setDraft] = useState<TagRecord>({ type: 'continent' })
  const [response, setResponse] = useState<FetchResult<TagRecord> | null>(null)
  const update = (x: TagRecord = draft) => {
    console.log('upsert', x)
    apolloClient
      .mutate({
        mutation: Tag.upsert(x),
      })
      .then(setResponse)
    setDraft(x)
  }
  return [draft, setDraft, update, response] as const
}

export default function TaxnonomyPage() {
  const [active, setActive] = useState<[number, number]>([0, 0])
  const [draft, setDraft, upsertDraft] = upsertTag()

  const [activeByRow, setActiveByRow] = useState<[number, number, number]>([
    0,
    0,
    0,
  ])
  useEffect(() => {
    activeByRow[active[0]] = active[1]
    setActiveByRow(activeByRow)
  }, [...active])

  const continentQuery = useSubscription(CONTINENTS_SUBSCRIPTION, {})
  const continent = (continentQuery.data?.tag ?? []) as TagRecord[]
  const selectedContinentId = continent[activeByRow[0]]?.id ?? ''
  const countryQuery = useSubscription(COUNTRIES_SUBSCRIPTION, {
    variables: { parentId: selectedContinentId },
  })
  const country = (countryQuery.data?.tag ?? []) as TagRecord[]
  const selectedCountryId = country[activeByRow[1]]?.id ?? ''
  const dishQuery = useSubscription(DISHES_SUBSCRIPTION, {
    variables: { parentId: selectedCountryId },
  })
  const dish = (dishQuery.data?.tag ?? []) as TagRecord[]
  const selectedDishId = country[activeByRow[2]]?.id ?? ''
  const selectedIds = {
    continent: selectedContinentId,
    country: selectedCountryId,
    dish: selectedDishId,
  }
  const tags = { continent, dish, country }

  useEffect(() => {
    const [row, col] = active
    const next = [continent, country, dish][row][col]
    if (next) {
      setDraft(next)
    }
  }, [active])

  const TagList = ({ type, row }: { type: TagType; row: number }) => {
    const [_, _2, upsert] = upsertTag()
    const parentType: TagType =
      type === 'continent'
        ? 'continent'
        : type === 'country'
        ? 'continent'
        : 'country'
    return (
      <>
        <Text>{type}</Text>
        <VStack>
          <Button
            title="Add new"
            onPress={() => {
              upsert({
                type,
                name: `⭐️ new ${Math.random()}`,
                icon: '',
                parentId:
                  parentType === 'country'
                    ? selectedCountryId
                    : parentType == 'continent'
                    ? selectedContinentId
                    : '',
                parentType,
              })
            }}
          />
          {tags[type].map((tag, index) => {
            return (
              <ListItem
                key={`${tag.id}${tag.updated_at}`}
                row={row}
                col={index}
                isActive={active[0] == row && active[1] == index}
                isFormerlyActive={tag.id === selectedIds[type]}
                tag={tag}
                setActive={setActive}
                upsert={upsert}
              />
            )
          })}
        </VStack>
      </>
    )
  }

  return (
    <VStack flex={1}>
      <HStack flex={2}>
        <VStack flex={1}>
          <TagList row={0} type="continent" />
        </VStack>

        <VStack flex={1}>
          <BorderLeft />
          <TagList row={1} type="country" />
        </VStack>

        <VStack flex={1}>
          <BorderLeft />
          <TagList row={2} type="dish" />
        </VStack>

        <VStack flex={1}>
          <BorderLeft />
          <Text>Menu Items</Text>
          <MenuItems active={active} setActive={setActive} />
        </VStack>
      </HStack>

      <View>
        <HStack>
          <Text>ID</Text>
          <TextInput
            style={styles.textInput}
            onChange={(e) => setDraft({ ...draft, id: e.target['value'] })}
            defaultValue={draft.id}
            onBlur={() => upsertDraft()}
          />
          <Text>Name</Text>
          <TextInput
            style={styles.textInput}
            onChange={(e) => setDraft({ ...draft, name: e.target['value'] })}
            defaultValue={draft.name}
            onBlur={() => upsertDraft()}
          />
          <Text>Icon</Text>
          <TextInput
            style={styles.textInput}
            onChange={(e) => setDraft({ ...draft, icon: e.target['value'] })}
            defaultValue={draft.icon}
            onBlur={() => upsertDraft()}
          />
          <select
            onChange={(e) =>
              setDraft({ ...draft, type: e.target.value as any })
            }
          >
            <option id="continent">Continent</option>
            <option id="country">Country</option>
            <option id="dish">Dish</option>
          </select>
          <Button
            title="Clear"
            onPress={() => {
              upsertDraft({ type: 'continent' })
            }}
          />
          <Button title="Create" onPress={() => upsertDraft()} />
        </HStack>
      </View>
    </VStack>
  )
}
const ListItem = ({
  row,
  col,
  tag,
  isActive,
  isFormerlyActive,
  setActive,
  editable = true,
  deletable = false,
  upsert,
}: {
  editable?: boolean
  deletable?: boolean
  row?: number
  col?: number
  tag: TagRecord
  isActive?: boolean
  setActive?: Function
  isFormerlyActive?: boolean
  upsert?: Function
}) => {
  const text = `${tag.icon} ${tag.name}`
  const [isEditing, setIsEditing] = useState(false)
  const [hidden, setHidden] = useState(false)
  const client = useApolloClient()
  if (hidden) return null
  return (
    <Tappable
      onTap={() => {
        setTimeout(() => {
          if (!isActive) {
            if (setActive && typeof row == 'number') {
              setActive([row, col])
            }
          }
        })
      }}
      onDoubleTap={() => {
        if (editable) {
          setIsEditing(true)
        }
      }}
    >
      <HStack padding={6}>
        <HStack flex={1}>
          {isEditing && (
            <TextInput
              style={styles.textInput}
              defaultValue={text as any}
              onBlur={(e) => {
                setIsEditing(false)
                const [icon, ...nameParts] = e.target['value'].split(' ')
                const name = nameParts.join(' ')
                const next: TagRecord = {
                  ...tag,
                  icon,
                  name,
                }
                console.log('next is', next)
                upsert(next)
              }}
            />
          )}
          {!isEditing && <Text style={styles.listItemText}>{text}</Text>}

          <div style={{ flex: 1 }} />

          {deletable && (
            <TouchableNativeFeedback
              onPress={(e) => {
                e.stopPropagation()
                setHidden(true)
                client.mutate({
                  variables: {
                    id: tag.id,
                  },
                  mutation: TAXONOMY_DELETE,
                })
              }}
            >
              <Ionicons name="md-checkmark-circle" />
            </TouchableNativeFeedback>
          )}
        </HStack>
      </HStack>
    </Tappable>
  )
}

function MenuItems({
  active,
  setActive,
}: {
  active: [number, number]
  setActive: Function
}) {
  const [search, setSearch] = useState('')
  const searchDebounced = search //useDebounceValue(search, 200)
  const { loading, error, data } = useQuery(DISHES_SEARCH, {
    variables: {
      limit: 100,
      search: searchDebounced,
    },
  })

  console.log({ search, loading, error, data })

  return (
    <>
      <TextInput
        style={styles.textInput}
        onChange={(e) => setSearch(e.target['value'])}
        placeholder="Search all MenuItems"
      />
      <VStack flex={1}>
        {loading && (
          <Text style={{ flex: 1, alignItems: 'center' }}>Loading...</Text>
        )}
        {!loading &&
          data.dish.map((dish, index) => {
            const isActive = active[0] === 0 && index === active[1]
            return (
              <VStack key={dish.id}>
                <TouchableOpacity
                  onPress={() => {
                    setTimeout(() => {
                      if (!isActive) {
                        setActive([4, index])
                      }
                    })
                  }}
                >
                  <Text>{dish.name}</Text>
                </TouchableOpacity>
              </VStack>
            )
          })}
      </VStack>
    </>
  )
}

const styles = StyleSheet.create({
  listItemText: {
    fontSize: 16,
  },
  textInput: {
    fontSize: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
})
