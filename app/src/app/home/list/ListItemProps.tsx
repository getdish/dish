import { list, restaurant, review } from '@dish/graph'
import React from 'react'

export type ListItemProps = {
  list?: list | null
  listTheme?: 'modern' | 'minimal'
  reviewQuery?: review[] | null
  username?: string
  restaurant: restaurant
  listSlug?: string
  hideRate?: boolean
  minimal?: boolean
  rank: number
  activeTagSlugs?: string[]
  onFinishRender?: Function
  editable?: boolean
  hideTagRow?: boolean
  above?: any
  onDelete: Function
}

export type ListItemContentProps = ListItemProps & {
  onUpdate: Function
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  isExternalReview?: boolean
}
