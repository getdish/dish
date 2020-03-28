import { graphql } from '@gqless/react'
import React, { memo, useMemo } from 'react'
import { query } from '../../../src/graphql'
import { useOvermind } from '../../state/om'
import { HomeStateItem } from '../../state/home'
import { Text } from 'react-native'
import Fuse from 'fuse.js'

const RADIUS = 0.15
let options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ['title', 'author.firstName'],
}

export default memo(function HomeAutoComplete() {
  const om = useOvermind()
  const state: HomeStateItem = om.state.home.currentState as any

  const fuzzy = useMemo(() => new Fuse(om.state.home.allTopDishes, options), [
    om.state.home.allTopDishes,
  ])

  const results = useMemo(() => {
    if (state.searchQuery) {
      fuzzy.search()
    }
  }, [state.searchQuery])
  fuzzy.search()

  return (
    <>
      {autocompleteResults.map((x) => {
        return <Text key={x}>{x}</Text>
      })}
    </>
  )
})
