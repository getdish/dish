import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { Link, useLocation, useParams } from 'react-router-dom'

import { useOvermind } from '../../state/om'

const styles = {
  container: {},
  header: {
    height: 40,
  },
}

export default function UserReviews() {
  const { state, actions } = useOvermind()
  const location = useLocation()
  let reviews: JSX.Element[] = []
  let { user } = useParams()
  const is_for_logged_in_user = location.pathname.includes('account/reviews')
  let title = `Restaurant reviews for ${user}`
  if (is_for_logged_in_user) {
    title = 'Your latest restaurant reviews'
  }

  useEffect(() => {
    if (is_for_logged_in_user) {
      user = state.auth.user.id
    }
    actions.map.getUserReviews(user)
  }, [])

  let key = 0
  for (const review of state.map.user_reviews) {
    key++
    reviews.push(
      <Text key={key}>
        <Link to={`/e/${review.restaurant.id}`}>{review.restaurant.name}</Link>
        <Text>{review.rating}⭐</Text>
        <Text>{review.text}</Text>
      </Text>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30 }}>{title}</Text>
      </View>
      {reviews.length != 0 ? reviews : <Text>No reviews yet...</Text>}
    </View>
  )
}
