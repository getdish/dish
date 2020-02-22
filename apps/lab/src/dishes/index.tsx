import { FetchResult, gql, useSubscription } from '@apollo/client'
import { ModelBase, Taxonomy, TaxonomyRecord, TaxonomyType } from '@dish/models'
import { BorderLeft, Button, Card, Input, Stack, Surface, Text, Theme, Title } from '@o/ui'
import React, { useEffect, useState } from 'react'

const TAXONOMY_SUBSCRIPTION = gql`
  subscription Taxonomy($type: String!) {
    taxonomy(where: { type: { _eq: $type } }, order_by: {order: asc}) {
      id ${Taxonomy.fieldsQuery}
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
  return [draft, update, response] as const
}

export const LabDishes = () => {
  const [active, setActive] = useState<[number, number]>([0, 0])
  const [draft, setDraft] = upsertTaxonomy()

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

  const TaxonomyList = ({ type }: { type: TaxonomyType }) => {
    const [_, upsert] = upsertTaxonomy()
    return (
      <>
        <Title size="sm" padding={10}>
          {type}
        </Title>
        <Stack overflow="scroll" flex={1}>
          {taxonomies[type].map((taxonomy, index) => {
            return (
              <EditableField
                key={`${taxonomy.id}${taxonomy.updated_at}`}
                row={0}
                col={index}
                isActive={active[0] == 0 && active[1] == index}
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
          <TaxonomyList type="continent" />
        </Stack>

        <Stack position="relative" flex={1}>
          <BorderLeft />
          <TaxonomyList type="country" />
        </Stack>

        <Stack position="relative" flex={1}>
          <BorderLeft />
          <TaxonomyList type="dish" />
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
            onEnter={setDraft}
          />
          Name{' '}
          <Input
            onChange={e => setDraft({ ...draft, name: e.target['value'] })}
            defaultValue={draft.name}
            onEnter={setDraft}
          />
          Icon{' '}
          <Input
            onChange={e => setDraft({ ...draft, icon: e.target['value'] })}
            defaultValue={draft.icon}
            onEnter={setDraft}
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
              setDraft({ type: 'continent' })
            }}
          >
            Clear
          </Button>
          <Button onClick={() => setDraft()}>Create</Button>
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
  row: number
  col: number
  taxonomy: TaxonomyRecord
  isActive: boolean
  setActive: Function
  upsert: Function
}) => {
  const text = `${taxonomy.icon} ${taxonomy.name}`
  const [isEditing, setIsEditing] = useState(false)
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
                setActive([row, col])
              }
        }
        onDoubleClick={() => {
          setIsEditing(true)
        }}
      >
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
      </Surface>
    </Theme>
  )
}
