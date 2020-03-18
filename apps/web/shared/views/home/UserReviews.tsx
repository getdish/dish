import React, { useEffect } from 'react'
import { Text, View } from 'react-native'

import { useOvermind } from '../../state/om'
import { Link } from '../shared/Link'

const styles = {
  container: {},
  header: {
    height: 40,
  },
}

export default function UserReviews() {
  const om = useOvermind()
  const state = om.state.home.currentState
  let user = `${om.state.router.curPage.params.user}`

  const is_for_logged_in_user = om.state.router.curPage.path.includes(
    'account/reviews'
  )
  let title = `Restaurant reviews for ${user}`
  if (is_for_logged_in_user) {
    title = 'Your latest restaurant reviews'
  }

  useEffect(() => {
    if (is_for_logged_in_user) {
      user = om.state.auth.user.id
    }
    om.actions.home.getUserReviews(user)
  }, [])

  if (state.type !== 'restaurant') {
    return null
  }

  const { reviews } = state

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30 }}>{title}</Text>
      </View>
      {reviews.length != 0 ? (
        reviews.map(review => (
          <Text key={review.id}>
            <Link name="restaurant" params={{ slug: review.restaurant.slug }}>
              {review.restaurant.name}
            </Link>
            <Text>{review.rating}⭐</Text>
            <Text>{review.text}</Text>
          </Text>
        ))
      ) : (
        <Text>No reviews yet...</Text>
      )}
    </View>
  )
}
