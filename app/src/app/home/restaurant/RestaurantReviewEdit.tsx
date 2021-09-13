import { graphql } from '@dish/graph'
import { Trash } from '@dish/react-feather'
import React, { useEffect, useState } from 'react'
import { Input, Spacer } from 'snackui'

import { red } from '../../../constants/colors'
import { AuthForm } from '../../AuthForm'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useCurrentUserQuery } from '../../hooks/useUserReview'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantReview, RestaurantReviewProps } from './RestaurantReview'

// const sentiments = review?.sentiments?.() ?? []
//                 {!!sentiments?.length &&
//                   uniqBy(sentiments, (x) => x.tag.name).map((x, i) => {
//                     const snt = x.ml_sentiment
//                     return (
//                       <React.Fragment key={i}>
//                         <SentimentText sentiment={snt}>{x.tag.name}</SentimentText>
//                         <Text>&nbsp;</Text>
//                       </React.Fragment>
//                     )
//                   })}

export const RestaurantReviewEdit = graphql((props: RestaurantReviewProps) => {
  const [user] = useCurrentUserQuery()
  const [reviewText, setReviewText] = useStateSynced('')
  const [isSaved, setIsSaved] = useState(false)
  // const [height, setHeight] = useState(lineHeight)

  const { review, onEdit, onDelete } = props

  useEffect(() => {
    if (review?.text) {
      setReviewText(review.text)
    }
  }, [review?.text])

  if (!user) {
    console.warn('no user')
    return <AuthForm />
  }

  return (
    <RestaurantReview
      {...props}
      showEmptyReview
      // prevent infinite recursion
      isEditing={false}
      avatar={{
        charIndex: user.charIndex || 0,
        image: user.avatar || '',
      }}
      name={user.name || user.username || ''}
      date={new Date()}
      text={
        <Input
          value={reviewText}
          // onChange={(e) => {
          //   // @ts-ignore
          //   const height = e.nativeEvent.srcElement.scrollHeight
          //   setHeight(height)
          // }}
          onChangeText={(text) => {
            if (isSaved) {
              setIsSaved(false)
            }
            setReviewText(text)
          }}
          multiline
          numberOfLines={5}
          placeholder="...a note, a tip, a whole review, it's up to you."
          marginHorizontal={-10}
          marginVertical={-5}
        />
      }
      after={
        <>
          <SmallButton
            theme="error"
            accessible
            accessibilityRole="button"
            icon={<Trash color="#fff" size={16} />}
            onPress={() => {
              if (confirm('Are you sure you want to delete the review?')) {
                onDelete?.()
              }
            }}
          />
          <Spacer size="sm" />
          <SmallButton
            themeInverse
            accessible
            accessibilityRole="button"
            disabled={isSaved}
            alignSelf="center"
            textProps={{
              fontWeight: '700',
            }}
            marginVertical={10}
            onPress={() => {
              setIsSaved(true)
              onEdit?.(reviewText)
            }}
          >
            Save
          </SmallButton>
        </>
      }
    />
  )
})
