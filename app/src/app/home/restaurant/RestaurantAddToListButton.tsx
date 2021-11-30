import { userStore } from '../../userStore'
import { SmallButton, SmallButtonProps } from '../../views/SmallButton'
import { RestaurantAddToListModal } from './RestaurantAddToListModal'
import { Plus } from '@tamagui/feather-icons'
import React, { Suspense, useState } from 'react'

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
  return (
    <>
      {!!(showModal && restaurantSlug) && (
        <Suspense fallback={null}>
          <RestaurantAddToListModal slug={restaurantSlug} onDismiss={() => setShowModal(false)} />
        </Suspense>
      )}
      <SmallButton
        tooltip="Add to list"
        elevation={floating ? '$1' : '$0'}
        borderRadius={100}
        icon={Plus}
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
