import { FetchResult, gql, useQuery, useSubscription } from '@apollo/client'
import { ModelBase, Taxonomy, TaxonomyRecord, TaxonomyType } from '@dish/models'
import { BorderLeft, Button, Card, Icon, Input, Stack, Surface, Text, Theme, Title, useDebounceValue } from '@o/ui'
import React, { useEffect, useState } from 'react'

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
        <Title size="sm" padding={10}>
          {type}
        </Title>
        <Stack overflow="scroll" flex={1}>
          <Button
            onClick={() => {
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
          >
            Add new
          </Button>
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
        </Stack>
      </>
    )
  }

  return (
    <Stack flex={1} overflow="hidden">
      <Stack flex={2} direction="horizontal" overflow="hidden">
        <Stack flex={1}>
          <TaxonomyList row={0} type="continent" />
        </Stack>

        <Stack position="relative" flex={1}>
          <BorderLeft />
          <TaxonomyList row={1} type="country" />
        </Stack>

        <Stack position="relative" flex={1}>
          <BorderLeft />
          <TaxonomyList row={2} type="dish" />
        </Stack>

        <Stack position="relative" flex={1}>
          <BorderLeft />
          <Title padding={10}>Menu Items</Title>
          <MenuItems active={active} setActive={setActive} />
        </Stack>
      </Stack>

      <Card defaultWidth={500} defaultHeight={350} elevation={6} visible>
        <Stack direction="horizontal" padding space>
          ID{' '}
          <Input
            onChange={e => setDraft({ ...draft, id: e.target['value'] })}
            defaultValue={draft.id}
            onEnter={upsertDraft}
          />
          Name{' '}
          <Input
            onChange={e => setDraft({ ...draft, name: e.target['value'] })}
            defaultValue={draft.name}
            onEnter={upsertDraft}
          />
          Icon{' '}
          <Input
            onChange={e => setDraft({ ...draft, icon: e.target['value'] })}
            defaultValue={draft.icon}
            onEnter={upsertDraft}
          />
          <select
            onChange={e => setDraft({ ...draft, type: e.target.value as any })}
          >
            <option id="continent">Continent</option>
            <option id="country">Country</option>
            <option id="dish">Dish</option>
          </select>
          <Button
            onClick={() => {
              upsertDraft({ type: 'continent' })
            }}
          >
            Clear
          </Button>
          <Button onClick={() => upsertDraft()}>Create</Button>
        </Stack>
      </Card>
    </Stack>
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
    <Theme
      name={isActive ? 'selected' : null}
      coat={isFormerlyActive ? 'selectedInactive' : null}
    >
      <Surface
        padding="sm"
        key={taxonomy.id}
        direction="horizontal"
        onClick={() => {
          setTimeout(() => {
            if (!isActive) {
              if (setActive && typeof row == 'number') {
                setActive([row, col])
              }
            }
          })
        }}
        onDoubleClick={() => {
          if (editable) {
            setIsEditing(true)
          }
        }}
      >
        <Stack flex={1} direction="horizontal" alignItems="center">
          {isEditing && (
            <Input
              size="xl"
              onEnter={e => {
                setIsEditing(false)
                const [icon, ...nameParts] = e.target['value'].split(' ')
                const name = nameParts.join(' ')
                const next: TaxonomyRecord = {
                  ...taxonomy,
                  icon,
                  name,
                }
                console.log('next is', next)
                upsert(next)
              }}
              defaultValue={text as any}
            />
          )}
          {!isEditing && <Text size="xl">{text}</Text>}

          <div style={{ flex: 1 }} />

          {deletable && (
            <Icon
              name="cross"
              opacity={0.5}
              onClick={e => {
                e.stopPropagation()
                setHidden(true)
                ModelBase.client.mutate({
                  variables: {
                    id: taxonomy.id,
                  },
                  mutation: TAXONOMY_DELETE,
                })
              }}
            />
          )}
        </Stack>
      </Surface>
    </Theme>
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
  const searchDebounced = useDebounceValue(search, 200)
  const { loading, error, data } = useQuery(DISHES_SEARCH, {
    variables: {
      limit: 100,
      search: searchDebounced,
    },
  })

  console.log({ search, loading, error, data })

  return (
    <>
      <Input
        onChange={e => setSearch(e.target['value'])}
        placeholder="Search all MenuItems"
      />
      <Stack direction="vertical" flex={1} overflowY="scroll">
        {loading && <Text>Loading...</Text>}
        {!loading &&
          data.dish.map((dish, index) => {
            const isActive = active[0] === 0 && index === active[1]
            return (
              <Theme name={isActive ? 'selected' : null}>
                <Surface
                  padding="sm"
                  key={dish.id}
                  direction="horizontal"
                  onClick={() => {
                    setTimeout(() => {
                      if (!isActive) {
                        setActive([4, index])
                      }
                    })
                  }}
                >
                  <Text size="xl">{dish.name}</Text>
                </Surface>
              </Theme>
            )
          })}
      </Stack>
    </>
  )
}
