import React, { useEffect, useState } from 'react'
import { Image, Text, View, TextInput, Button } from 'react-native'
import { Link } from 'react-router-dom'
import { AirbnbRating } from 'react-native-ratings'

import { useOvermind } from '../../state/om'
import { Review } from '@dish/models'

const styles = {
  container: { flex: 1, width: 400 },
  text_input: {
    borderWidth: 1,
    borderRadius: 3,
    padding: '1em',
    marginBottom: '0.5em',
  },
}

export default function ReviewForm() {
  const { state, actions } = useOvermind()
  const [rating, setRating] = useState(0)
  const [review_text, setReviewText] = useState('')
  const [button_text, setButtonText] = useState('Submit')

  useEffect(() => {
    const init = async () => {
      await actions.map.getReview()
      if (state.map.current_review.id) {
        setReviewText(state.map.current_review.text)
        setRating(state.map.current_review.rating.toString())
      }
    }
    init()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25 }}>Your review</Text>
      <AirbnbRating
        defaultRating={rating}
        showRating={false}
        onFinishRating={(rating: number) => {
          setRating(rating)
          setButtonText('Submit')
        }}
        style={{ paddingVertical: 10 }}
      />
      <TextInput
        style={styles.text_input}
        placeholder="Your review"
        value={review_text}
        multiline={true}
        onFocus={() => setButtonText('Submit')}
        onChange={event => {
          setReviewText(event.target.value)
        }}
      />
      <Button
        onPress={async () => {
          setButtonText('Submitting...')
          await actions.map.submitReview([rating, review_text])
          setButtonText('Saved')
        }}
        title={button_text}
      ></Button>
    </View>
  )
}
