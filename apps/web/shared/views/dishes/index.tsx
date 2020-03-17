import { Col, Row, Grid } from 'react-native-easy-grid'
import { FetchResult, gql, useQuery, useSubscription } from '@apollo/client'
import { ModelBase, Taxonomy, TaxonomyRecord, TaxonomyType } from '@dish/models'
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableNativeFeedback,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Tappable from '../shared/Tappable'

const CONTINENTS_SUBSCRIPTION = gql`
subscription Taxonomy {
  taxonomy(where: { type: { _eq: "continent" } }, order_by: {order: asc}) {
    id ${Taxonomy.fieldsQuery}
  }
}
`

const COUNTRIES_SUBSCRIPTION = gql`
subscription Taxonomy($parentId: uuid!) {
  taxonomy(where: { type: { _eq: "country" }, parentId: { _eq: $parentId }, parentType: { _eq: "continent" } }, order_by: {order: asc}) {
    id ${Taxonomy.fieldsQuery}
  }
}
`

const DISHES_SUBSCRIPTION = gql`
subscription Taxonomy($parentId: uuid!) {
  taxonomy(where: { type: { _eq: "dish" }, parentId: { _eq: $parentId }, parentType: { _eq: "country" } }, order_by: {order: asc}) {
    id ${Taxonomy.fieldsQuery}
  }
}
`

const TAXONOMY_DELETE = gql`
  mutation Delete($id: uuid!) {
    delete_taxonomy(where: { id: { _eq: $id } }) {
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

const upsertTaxonomy = () => {
  const [draft, setDraft] = useState<TaxonomyRecord>({ type: 'continent' })
  const [response, setResponse] = useState<FetchResult<TaxonomyRecord> | null>(
    null
  )
  const update = (x: TaxonomyRecord = draft) => {
    console.log('upsert', x)
    ModelBase.client
      .mutate({
        mutation: Taxonomy.upsert(x),
      })
      .then(setResponse)
    setDraft(x)
  }
  return [draft, setDraft, update, response] as const
}

export const LabDishes = () => {
  const [active, setActive] = useState<[number, number]>([0, 0])
  const [draft, setDraft, upsertDraft] = upsertTaxonomy()

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
  const continent = (continentQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const selectedContinentId = continent[activeByRow[0]]?.id ?? ''
  const countryQuery = useSubscription(COUNTRIES_SUBSCRIPTION, {
    variables: { parentId: selectedContinentId },
  })
  const country = (countryQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const selectedCountryId = country[activeByRow[1]]?.id ?? ''
  const dishQuery = useSubscription(DISHES_SUBSCRIPTION, {
    variables: { parentId: selectedCountryId },
  })
  const dish = (dishQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const selectedDishId = country[activeByRow[2]]?.id ?? ''
  const selectedIds = {
    continent: selectedContinentId,
    country: selectedCountryId,
    dish: selectedDishId,
  }
  const taxonomies = { continent, dish, country }

  useEffect(() => {
    const [row, col] = active
    const next = [continent, country, dish][row][col]
    if (next) {
      setDraft(next)
    }
  }, [active])

  const TaxonomyList = ({ type, row }: { type: TaxonomyType; row: number }) => {
    const [_, _2, upsert] = upsertTaxonomy()
    const parentType: TaxonomyType =
      type === 'continent'
        ? 'continent'
        : type === 'country'
        ? 'continent'
        : 'country'
    return (
      <>
        <Text>{type}</Text>
        <Col>
          <Button
            title="Add new"
            onPress={() => {
              upsert({
                type,
                name: 'New',
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
          {taxonomies[type].map((taxonomy, index) => {
            return (
              <ListItem
                key={`${taxonomy.id}${taxonomy.updated_at}`}
                row={row}
                col={index}
                isActive={active[0] == row && active[1] == index}
                isFormerlyActive={taxonomy.id === selectedIds[type]}
                taxonomy={taxonomy}
                setActive={setActive}
                upsert={upsert}
              />
            )
          })}
        </Col>
      </>
    )
  }

  return (
    <Col size={1}>
      <Row size={2}>
        <Col size={1}>
          <TaxonomyList row={0} type="continent" />
        </Col>

        <Col size={1}>
          <BorderLeft />
          <TaxonomyList row={1} type="country" />
        </Col>

        <Col size={1}>
          <BorderLeft />
          <TaxonomyList row={2} type="dish" />
        </Col>

        <Col size={1}>
          <BorderLeft />
          <Text>Menu Items</Text>
          <MenuItems active={active} setActive={setActive} />
        </Col>
      </Row>

      <View>
        <Row>
          <Text>ID</Text>
          <TextInput
            onChange={e => setDraft({ ...draft, id: e.target['value'] })}
            defaultValue={draft.id}
            // onEnter={upsertDraft}
          />
          <Text>Name</Text>
          <TextInput
            onChange={e => setDraft({ ...draft, name: e.target['value'] })}
            defaultValue={draft.name}
            // onEnter={upsertDraft}
          />
          <Text>Icon</Text>
          <TextInput
            onChange={e => setDraft({ ...draft, icon: e.target['value'] })}
            defaultValue={draft.icon}
            // onEnter={upsertDraft}
          />
          <select
            onChange={e => setDraft({ ...draft, type: e.target.value as any })}
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
        </Row>
      </View>
    </Col>
  )
}
const ListItem = ({
  row,
  col,
  taxonomy,
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
  taxonomy: TaxonomyRecord
  isActive?: boolean
  setActive?: Function
  isFormerlyActive?: boolean
  upsert?: Function
}) => {
  const text = `${taxonomy.icon} ${taxonomy.name}`
  const [isEditing, setIsEditing] = useState(false)
  const [hidden, setHidden] = useState(false)
  if (hidden) return null
  return (
    // <Theme
    //   name={isActive ? 'selected' : null}
    //   coat={isFormerlyActive ? 'selectedInactive' : null}
    // >
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
      <Row>
        <Row size={1}>
          {isEditing && (
            <TextInput
              // onEnter={e => {
              //   setIsEditing(false)
              //   const [icon, ...nameParts] = e.target['value'].split(' ')
              //   const name = nameParts.join(' ')
              //   const next: TaxonomyRecord = {
              //     ...taxonomy,
              //     icon,
              //     name,
              //   }
              //   console.log('next is', next)
              //   upsert(next)
              // }}
              defaultValue={text as any}
            />
          )}
          {!isEditing && <Text>{text}</Text>}

          <div style={{ flex: 1 }} />

          {deletable && (
            <TouchableNativeFeedback
              onPress={e => {
                e.stopPropagation()
                setHidden(true)
                ModelBase.client.mutate({
                  variables: {
                    id: taxonomy.id,
                  },
                  mutation: TAXONOMY_DELETE,
                })
              }}
            >
              <Ionicons name="md-checkmark-circle" />
            </TouchableNativeFeedback>
          )}
        </Row>
      </Row>
    </Tappable>
    // </Theme>
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
        onChange={e => setSearch(e.target['value'])}
        placeholder="Search all MenuItems"
      />
      <Col size={1}>
        {loading && (
          <Text style={{ flex: 1, alignItems: 'center' }}>Loading...</Text>
        )}
        {!loading &&
          data.dish.map((dish, index) => {
            const isActive = active[0] === 0 && index === active[1]
            return (
              <Col
                // name={isActive ? 'selected' : null}
                key={dish.id}
                onPress={() => {
                  setTimeout(() => {
                    if (!isActive) {
                      setActive([4, index])
                    }
                  })
                }}
              >
                <Text>{dish.name}</Text>
              </Col>
            )
          })}
      </Col>
    </>
  )
}
