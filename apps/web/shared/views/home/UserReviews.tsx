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
  let user = `${om.state.router.curPage.params.user}`

  let reviews: JSX.Element[] = []
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

  let key = 0
  for (const review of om.state.home.user_reviews) {
    key++
    reviews.push(
      <Text key={key}>
        <Link to={`/restaurant/${review.restaurant.id}`}>
          {review.restaurant.name}
        </Link>
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
