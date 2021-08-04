import { Plus } from '@dish/react-feather'
import React, { Suspense, useState } from 'react'
import { Button, Tooltip } from 'snackui'

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
  return (
    <>
      {!!(showModal && restaurantSlug) && (
        <Suspense fallback={null}>
          <RestaurantAddToListModal slug={restaurantSlug} onDismiss={() => setShowModal(false)} />
        </Suspense>
      )}
      <Tooltip contents="Add to list">
        <SmallButton
          elevation={floating ? 1 : 0}
          borderRadius={100}
          icon={<Plus color={'#777'} size={16} />}
          onPress={() => {
            if (!userStore.promptLogin()) {
              setShowModal(true)
            }
          }}
          {...props}
        >
          {noLabel ? null : 'List'}
        </SmallButton>
      </Tooltip>
    </>
  )
}
