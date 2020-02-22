import { gql, useMutation, useSubscription } from '@apollo/client'
import { Taxonomy, TaxonomyRecord } from '@dish/models'
import { BorderLeft, Button, Card, Input, Stack, Surface, Text, Theme, Title } from '@o/ui'
import React, { useEffect, useState } from 'react'

const ALL_TAXONOMY_SUBSCRIPTION = gql`
  subscription Taxonomy($type: String!) {
    taxonomy(where: { type: { _eq: $type } }) {
      ${Taxonomy.fieldsQuery}
    }
  }
`

const TAXONOMY_BY_TYPE_SUBSCRIPTION = gql`
  subscription Taxonomy($type: String!) {
    taxonomy(where: { type: { _eq: $type } }) {
      ${Taxonomy.fieldsQuery}
    }
  }
`

const upsertTaxonomy = () => {
  const [draft, setDraft] = useState<TaxonomyRecord>({ type: 'continent' })
  const [upsert, response] = useMutation(Taxonomy.upsert(draft))
  const update = (x: TaxonomyRecord) => {
    setDraft(x)
    upsert()
  }
  return [draft, update, response] as const
}

export const LabDishes = () => {
  const [active, setActive] = useState<[number, number]>([0, 0])
  const [draft, setDraft] = upsertTaxonomy()

  const continentsQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'continent' },
  })
  const countriesQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'country' },
  })
  const dishesQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'dish' },
  })
  const continents = (continentsQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const countries = (countriesQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const dishes = (dishesQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const taxonomies = { continents, dishes, countries }

  const TaxonomyList = ({ type }: { type: TaxonomyType }) => {
    return (
      <>
        <Title size="sm" padding={10}>
          {type}
        </Title>
        {taxonomies[type].map((taxonomy, index) => {
          return (
            <EditableField
              key={taxonomy.id}
              row={0}
              col={index}
              isActive={active[0] == 0 && active[1] == index}
              taxonomy={taxonomy}
              setActive={setActive}
              upsert={setDraft}
            />
          )
        })}
      </>
    )
  }

  return (
    <Stack flex={1}>
      <Stack flex={2} direction="horizontal">
        <Stack flex={1}></Stack>

        <Stack position="relative" flex={1}>
          <BorderLeft />
          <Title padding={10}>Countries</Title>
          {countries.map(taxonomy => {
            return (
              <Stack padding="sm" key={taxonomy.id} direction="horizontal">
                <Text size="lg">
                  {taxonomy.icon} {taxonomy.name}
                </Text>
              </Stack>
            )
          })}
        </Stack>

        <Stack position="relative" flex={1}>
          <BorderLeft />
          <Title padding={10}>Dishes</Title>
          {dishes.map(taxonomy => {
            return (
              <Stack padding="sm" key={taxonomy.id} direction="horizontal">
                <Text>
                  {taxonomy.icon} {taxonomy.name}
                </Text>
              </Stack>
            )
          })}
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
            onChange={e => saveDraft({ ...draft, type: e.target.value as any })}
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
              const [icon, name] = [...e.target['value'].split(' '), '']
              upsert({
                ...taxonomy,
                icon,
                name,
              })
            }}
            defaultValue={text as any}
          />
        )}
        {!isEditing && <Text size="xl">{text}</Text>}
      </Surface>
    </Theme>
  )
}
