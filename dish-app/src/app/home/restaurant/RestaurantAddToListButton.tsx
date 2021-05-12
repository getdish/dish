import { Plus } from '@dish/react-feather'
import React, { Suspense, useState } from 'react'
import { Button, Tooltip } from 'snackui'

import { userStore } from '../../userStore'
import { SmallButtonProps } from '../../views/SmallButton'
import { RestaurantAddToListModal } from './RestaurantAddToListModal'

export const RestaurantAddToListButton = ({
  restaurantSlug,
  noLabel,
  ...props
}: SmallButtonProps & {
  restaurantSlug?: string
  noLabel?: boolean
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
        <Button
          borderRadius={100}
          icon={<Plus color={'#777'} size={16} />}
          onPress={() => {
            if (!userStore.promptLogin()) {
              setShowModal(true)
            }
          }}
          pressStyle={{
            opacity: 0.6,
          }}
          elevation={1}
          {...props}
        >
          {noLabel ? null : 'List'}
        </Button>
      </Tooltip>
    </>
  )
}
