import { gql, useMutation, useSubscription } from '@apollo/client'
import { Taxonomy, TaxonomyRecord } from '@dish/models'
import { useOnMount } from '@o/ui'
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
  const [type, setType] = useState(`continent`)
  const taxonomy: TaxonomyRecord = { type: 'continent', name, icon }
  const [addTaxonomy, response] = useMutation(Taxonomy.create(taxonomy))

  useOnMount(async () => {
    const all = await Taxonomy.findContinents()
  })

  const { data, loading } = useSubscription(ALL_TAXONOMY_SUBSCRIPTION, {
    variables: {
      type: 'continent',
    },
  })

  console.log('get to...', loading, data, response)

  return (
    <>
      <h1>Taxonomy, loading {`${loading}`}</h1>
      <p>{JSON.stringify(data)}</p>
      <hr />
      <h1>
        Add:
        <br />
        Name <input onChange={e => setName(e.target.value)} />
        <br />
        Icon <input onChange={e => setIcon(e.target.value)} />
        <br />
        <select onChange={e => setType(e.target.value)}>
          <option id="continent">Continent</option>
          <option id="country">Country</option>
          <option id="dish">Dish</option>
        </select>
        <button
          onClick={() => {
            addTaxonomy()
          }}
        >
          Create
        </button>
      </h1>
      <p>response: {!!response}</p>
    </>
  )
}
