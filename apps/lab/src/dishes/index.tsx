import { gql, useMutation, useSubscription } from '@apollo/client'
import { Taxonomy, TaxonomyRecord, TaxonomyType } from '@dish/models'
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
  const update = (x: TaxonomyRecord = draft) => {
    setDraft(x)
    upsert()
  }
  return [draft, update, response] as const
}

export const LabDishes = () => {
  const [active, setActive] = useState<[number, number]>([0, 0])
  const [draft, setDraft] = upsertTaxonomy()

  const continentQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'continent' },
  })
  const countryQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'country' },
  })
  const dishQuery = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: { type: 'dish' },
  })
  const continent = (continentQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const country = (countryQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const dish = (dishQuery.data?.taxonomy ?? []) as TaxonomyRecord[]
  const taxonomies = { continent, dish, country }

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
