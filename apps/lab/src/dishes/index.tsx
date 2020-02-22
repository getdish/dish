import { FetchResult, gql, useSubscription } from '@apollo/client'
import { ModelBase, Taxonomy, TaxonomyRecord, TaxonomyType } from '@dish/models'
import { BorderLeft, Button, Card, Icon, Input, Stack, Surface, Text, Theme, Title } from '@o/ui'
import React, { useEffect, useState } from 'react'

const TAXONOMY_SUBSCRIPTION = gql`
subscription Taxonomy($type: String!) {
  taxonomy(where: { type: { _eq: $type } }, order_by: {order: asc}) {
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

  const continentQuery = useSubscription(TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'continent' },
  })
  const countryQuery = useSubscription(TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'country' },
  })
  const dishQuery = useSubscription(TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'dish' },
  })
  const continent = (continentQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const country = (countryQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const dish = (dishQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
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
    return (
      <>
        <Title size="sm" padding={10}>
          {type}
        </Title>
        <Stack overflow="scroll" flex={1}>
          <Button
            onClick={() => {
              upsert({ type, name: 'New', icon: '' })
            }}
          >
            Add new
          </Button>
          {taxonomies[type].map((taxonomy, index) => {
            return (
              <EditableField
                key={`${taxonomy.id}${taxonomy.updated_at}`}
                row={row}
                col={index}
                isActive={active[0] == row && active[1] == index}
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
const EditableField = ({
  row,
  col,
  taxonomy,
  isActive,
  setActive,
  upsert,
}: {
  row?: number
  col?: number
  taxonomy: TaxonomyRecord
  isActive?: boolean
  setActive?: Function
  upsert: Function
}) => {
  const text = `${taxonomy.icon} ${taxonomy.name}`
  const [isEditing, setIsEditing] = useState(false)
  const [hidden, setHidden] = useState(false)
  if (hidden) return null
  return (
    <Theme name={isActive ? 'selected' : null}>
      <Surface
        padding="sm"
        key={taxonomy.id}
        direction="horizontal"
        onClick={
          isActive
            ? null
            : () => {
                if (setActive && typeof row == 'number') {
                  setActive([row, col])
                }
              }
        }
        onDoubleClick={() => {
          setIsEditing(true)
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
        </Stack>
      </Surface>
    </Theme>
  )
}
