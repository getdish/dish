import { graphql } from '@gqless/react'
import React, { memo } from 'react'
import { query } from '../../../src/graphql'
import { useOvermind } from '../../state/om'
import { HomeStateItem } from '../../state/home'
import { Text } from 'react-native'

const RADIUS = 0.15

export default memo(
  graphql(function HomeAutoComplete() {
    const om = useOvermind()
    const state: HomeStateItem = om.state.home.currentState as any
    const res = query.top_dishes({
      limit: 5,
      // where: {
      //   name: {
      //     _ilike: `${state.searchQuery}`,
      //   },
      // },
      args: {
        lat: state.center.lat,
        lon: state.center.lng,
        radius: RADIUS,
      },
    })

    return (
      <>
        {res.map((x) => {
          return <Text key={x.dish}>{x.dish}</Text>
        })}
      </>
    )
  })
)
