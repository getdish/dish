import { Taxonomy } from '@dish/models'
import { useOnMount } from '@o/ui'
import React, { useEffect } from 'react'

export const LabDishes = () => {
  useOnMount(async () => {
    const all = await Taxonomy.findContinents()
    console.log('got all taxonomies', all)
  })

  return <>Hello wrodl</>
}
