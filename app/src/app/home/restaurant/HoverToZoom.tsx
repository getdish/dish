import { Hoverable } from '@dish/ui'
import { debounce } from 'lodash'
import React from 'react'

import { appMapStore } from '../../appMapStore'

/**
 * NOTE
 *
 * use slug for anything NOT logged in
 *
 * for logged in calls, we often need to user restaurant_id
 */
export const HoverToZoom = ({
  children,
  ...props
}: {
  children: any
  id: string
  slug?: string
}) => {
  return (
    <Hoverable
      onHoverIn={() => {
        setHoveredSlow({
          slug: '',
          ...props,
          // todo get from context?
          via: 'list',
        })
      }}
      onHoverOut={() => {
        setHoveredSlow.cancel()
      }}
    >
      {children}
    </Hoverable>
  )
}
const setHoveredSlow = debounce(appMapStore.setHovered, 400)
