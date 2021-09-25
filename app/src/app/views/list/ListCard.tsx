import { getUserName, graphql, mutate, query, resolved, slugify } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense, memo, useState } from 'react'
import { AbsoluteVStack, Hoverable, Toast, VStack, useThemeName } from 'snackui'

import { selectTagDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { FeedCard, FeedCardProps } from '../../home/FeedCard'
import { getListPhoto } from '../../home/getListPhoto'
import { useListColors } from '../../home/list/listColors'
import { ListFavoriteButton } from '../../home/restaurant/ListFavoriteButton'
import { useUserStore } from '../../userStore'
import { CloseButton } from '../CloseButton'
import { Link } from '../Link'
import { SuspenseFallback } from '../SuspenseFallback'
import { ListQueryProps, useList } from './useList'

export type ListCardProps = ListQueryProps &
  FeedCardProps & {
    onHover?: (is: boolean) => any
    floating?: boolean
    colored?: boolean
    deletable?: boolean
    onDelete?: () => void
  }

export const ListCard = memo((props: ListCardProps) => {
  return (
    <SuspenseFallback>
      <ListCardContent {...props} />
    </SuspenseFallback>
  )
})

const ListCardContent = graphql((props: ListCardProps) => {
  const { list } = useList(props)
  const numItems = list?.restaurants_aggregate().aggregate?.count() ?? 0
  const listColors = useListColors(list?.color)
  const themeName = useThemeName()
  return (
    <ListCardFrame
      title={list?.name ?? ''}
      numItems={numItems}
      author={` by ${getUserName(list?.user)}`}
      {...props}
      tags={
        props.size === 'xs'
          ? []
          : list
              ?.tags({ limit: 2 })
              .map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
              .filter(isPresent)
      }
      photo={getListPhoto(list)}
      {...(props.colored && {
        color: themeName === 'dark' ? listColors.darkColor : listColors.lightColor,
        backgroundColor: listColors.backgroundColor,
        chromeless: true,
        flat: true,
      })}
    />
  )
})

export const ListCardFrame = graphql((props: ListCardProps) => {
  const [hidden, setHidden] = useState(false)
  const { list, onHover, outside, deletable, onDelete, theme, ...feedCardProps } = props
  const userStore = useUserStore()

  if (hidden) {
    return null
  }

  const userSlug = slugify(list.user?.username)
  const contents = (
    <Link width="100%" asyncClick name="list" params={{ slug: list.slug || '', userSlug }}>
      <FeedCard
        theme={theme}
        outside={
          <>
            {outside}
            {!!(
              userStore.isAdmin ||
              (userSlug && userStore.user?.username === userSlug && deletable)
            ) && (
              <AbsoluteVStack zIndex={1000} pointerEvents="auto" top={-5} right={-5}>
                <CloseButton
                  size={40}
                  shadowed
                  pointerEvents="auto"
                  onPress={async (e) => {
                    if (!confirm('Are you sure you want to delete?')) {
                      return
                    }
                    e.stopPropagation()
                    setHidden(true)
                    Toast.show('Deleted')
                    try {
                      const userId = await resolved(
                        () =>
                          query.user({
                            where: {
                              username: {
                                _eq: userSlug,
                              },
                            },
                          })?.[0].id
                      )
                      if (!userId) {
                        throw new Error(`no user ${userId}`)
                      }
                      const numDeleted = await mutate(
                        (mutation) =>
                          mutation.delete_list({
                            where: {
                              _and: [
                                {
                                  slug: {
                                    _eq: list.slug,
                                  },
                                },
                                {
                                  user_id: {
                                    _eq: userId,
                                  },
                                },
                              ],
                            },
                          })?.affected_rows
                      )
                      if (!numDeleted) {
                        throw new Error(`Didn't delete any: ${numDeleted}`)
                      }
                      onDelete?.()
                    } catch (err) {
                      console.error(err)
                      Toast.show(`Error ${err.message ?? ''}`)
                    }
                  }}
                />
              </AbsoluteVStack>
            )}
          </>
        }
        pressable
        flat
        chromeless
        floating
        {...feedCardProps}
      >
        {!props.size?.endsWith('xs') && (
          <VStack x={-5}>
            <Suspense fallback={null}>
              <ListFavoriteButton list={props.list} query={props.query} />
            </Suspense>
          </VStack>
        )}
      </FeedCard>
    </Link>
  )

  if (onHover) {
    return (
      <Hoverable onHoverIn={() => onHover(true)} onHoverOut={() => onHover(true)}>
        {contents}
      </Hoverable>
    )
  }

  return contents
})
