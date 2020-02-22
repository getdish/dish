import { gql, useMutation, useSubscription } from '@apollo/client'
import { Taxonomy, TaxonomyRecord, TaxonomyType } from '@dish/models'
import { BorderLeft, Button, Card, Input, Stack, Text, Title, useOnMount } from '@o/ui'
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
  const [name, setName] = useState(``)
  const [icon, setIcon] = useState(``)
  const [type, setType] = useState<TaxonomyType>(`continent`)
  const taxonomy: TaxonomyRecord = { type, name, icon }
  const [addTaxonomy, response] = useMutation(Taxonomy.create(taxonomy))

  useOnMount(async () => {
    const all = await Taxonomy.findContinents()
  })

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

  return (
    <Stack flex={1}>
      <Stack flex={2} direction="horizontal">
        <Stack flex={1}>
          <Title padding={10}>Continents</Title>
          {continents.map(taxonomy => {
            return (
              <Stack padding="sm" key={taxonomy.id} direction="horizontal">
                <Text size="xl">
                  {taxonomy.icon} {taxonomy.name}
                </Text>
              </Stack>
            )
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
          Name <Input onChange={e => setName(e.target['value'])} />
          Icon <Input onChange={e => setIcon(e.target['value'])} />
          <select onChange={e => setType(e.target.value as any)}>
            <option id="continent">Continent</option>
            <option id="country">Country</option>
            <option id="dish">Dish</option>
          </select>
          <Button
            onClick={() => {
              addTaxonomy()
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
