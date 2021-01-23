import { graphql, slugify } from '@dish/graph'
import { Award, Edit, List, Menu, Plus, Server } from '@dish/react-feather'
import React from 'react'

import { userStore } from '../../userStore'
import { SmallButton, SmallButtonProps } from '../../views/SmallButton'

export const RestaurantAddToListButton = ({
  restaurantSlug,
  size,
  ...props
}: SmallButtonProps & {
  size?: number
  restaurantSlug?: string
}) => {
  return (
    <SmallButton
      theme="active"
      name="list"
      promptLogin
      params={{
        userSlug: 'me',
        slug: 'createRestaurant',
        state: restaurantSlug,
      }}
      pressStyle={{
        opacity: 0.6,
      }}
      icon={<Plus color="var(--color)" size={size ?? 16} />}
      {...props}
    >
      List
    </SmallButton>
  )
}
