import { Button, Tooltip, useTheme } from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import React, { Suspense, useState } from 'react'

import { userStore } from '../../userStore'
import { SmallButton, SmallButtonProps } from '../../views/SmallButton'
import { RestaurantAddToListModal } from './RestaurantAddToListModal'

export const RestaurantAddToListButton = ({
  restaurantSlug,
  floating,
  noLabel,
  ...props
}: SmallButtonProps & {
  restaurantSlug?: string
  noLabel?: boolean
  floating?: boolean
}) => {
  const [showModal, setShowModal] = useState(false)
  const theme = useTheme()
  return (
    <>
      {!!(showModal && restaurantSlug) && (
        <Suspense fallback={null}>
          <RestaurantAddToListModal slug={restaurantSlug} onDismiss={() => setShowModal(false)} />
        </Suspense>
      )}
      <SmallButton
        tooltip="Add to list"
        elevation={floating ? 1 : 0}
        borderRadius={100}
        icon={<Plus color={theme.color} size={16} />}
        onPress={() => {
          if (!userStore.promptLogin()) {
            setShowModal(true)
          }
        }}
        {...props}
      >
        {noLabel ? null : 'List'}
      </SmallButton>
    </>
  )
}
