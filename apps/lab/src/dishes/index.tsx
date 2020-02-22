import { gql, useMutation, useSubscription } from '@apollo/client'
import { Taxonomy, TaxonomyRecord } from '@dish/models'
import { BorderLeft, Button, Card, Input, Stack, Text, Title } from '@o/ui'
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

export const LabDishes = () => {
  const [draft, setDraft] = useState<TaxonomyRecord>({ type: 'continent' })
  const [upsert, response] = useMutation(Taxonomy.upsert(draft))
  const saveDraft = (x: TaxonomyRecord) => {
    setDraft(x)
    upsert()
  }

  const continentsQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'continent' },
  })
  const continents = (continentsQuery.data?.taxonomy ?? []) as TaxonomyRecord[]

  const countriesQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'country' },
  })
  const countries = (countriesQuery.data?.taxonomy ?? []) as TaxonomyRecord[]

  const dishesQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'dish' },
  })
  const dishes = (dishesQuery.data?.taxonomy ?? []) as TaxonomyRecord[]

  const EditableField = ({ taxonomy }: { taxonomy: TaxonomyRecord }) => {
    const text = `${taxonomy.icon} ${taxonomy.name}`
    const [isEditing, setIsEditing] = useState(false)
    return (
      <Stack padding="sm" key={taxonomy.id} direction="horizontal">
        {isEditing && (
          <Input
            size="xl"
            onEnter={e => {
              setIsEditing(false)
              const [icon, name] = [...e.target['value'].split(' '), '']
              saveDraft({
                ...taxonomy,
                icon,
                name,
              })
            }}
            defaultValue={text as any}
          />
        )}
        {!isEditing && (
          <Text size="xl" onClick={() => setIsEditing(true)}>
            {text}
          </Text>
        )}
      </Stack>
    )
  }

  return (
    <Stack flex={1}>
      <Stack flex={2} direction="horizontal">
        <Stack flex={1}>
          <Title padding={10}>Continents</Title>
          {continents.map(taxonomy => {
            return <EditableField key={taxonomy.id} taxonomy={taxonomy} />
          })}
        </Stack>

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
        <Stack padding space>
          Name{' '}
          <Input
            onChange={e => setDraft({ ...draft, name: e.target['value'] })}
            onEnter={upsert}
          />
          Icon{' '}
          <Input
            onChange={e => setDraft({ ...draft, icon: e.target['value'] })}
            onEnter={upsert}
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
              upsert()
            }}
          >
            Create
          </Button>
          <p>response: {!!response}</p>
        </Stack>
      </Card>
    </Stack>
  )
}
