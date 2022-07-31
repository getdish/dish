import { appMapStore } from '../../appMapStore'
import { Hoverable } from '@dish/ui'
import { debounce } from 'lodash'
import React from 'react'

/**
 * NOTE
 *
 * use slug for anything NOT logged in
 *
 * for logged in calls, we often need to user restaurant_id
 */
export const HoverToZoom = ({ children, slug }: { children: any; slug: string }) => {
  return (
    <Hoverable
      onHoverIn={() => {
        setHoveredSlow({
          slug: slug,
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
