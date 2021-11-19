import { graphql } from '@dish/graph'
import { Input, Spacer } from '@dish/ui'
import { Trash } from '@tamagui/feather-icons'
import React, { useEffect, useState } from 'react'

import { red700 } from '../../../constants/colors'
import { AuthForm } from '../../AuthForm'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useCurrentUserQuery } from '../../hooks/useUserReview'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantReview, RestaurantReviewProps } from './RestaurantReview'

export const RestaurantReviewEdit = graphql((props: RestaurantReviewProps) => {
  const { review, onEdit, onDelete } = props
  const [user] = useCurrentUserQuery()
  const [reviewText, setReviewText] = useStateSynced('')
  const [isSaved, setIsSaved] = useState(false)
  // const [height, setHeight] = useState(lineHeight)

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
          numberOfLines={6}
          lineHeight={22}
          placeholder="Write..."
          autoFocus
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
            icon={<Trash color={red700} size={16} />}
            onPress={() => {
              if (confirm('Are you sure you want to delete the review?')) {
                onDelete?.()
              }
            }}
          />
          <Spacer size="sm" />
          <SmallButton
            theme="active"
            accessible
            accessibilityRole="button"
            disabled={isSaved}
            alignSelf="center"
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
