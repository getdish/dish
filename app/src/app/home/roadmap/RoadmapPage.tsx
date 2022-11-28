import { HomeStateItemAbout } from '../../../types/homeTypes'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { upsertUserReview } from '../../hooks/useUserReview'
import { useUserStore, userStore } from '../../userStore'
import { LinkButton } from '../../views/LinkButton'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { PageContent } from '../PageContent'
import { OneUUID, ZeroUUID, order_by, review, useQuery, useRefetch } from '@dish/graph'
import { Button, Input, Paragraph, Spacer, XGroup, XStack, YStack } from '@dish/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useCallback, useState } from 'react'
import { FlatList } from 'react-native'

const ROADMAP_ID = ZeroUUID
const ROADMAP_REVIEW_ID = OneUUID

const icons = ['🐛', '📬', '🤨']
const descriptions = ['issue', 'request', 'question']
const types = {
  item: 'roadmap-item',
  vote: 'roadmap-vote',
}

const ADD_ITEM = {
  text: null,
  votes: null,
  authored_at: null,
  icon: '➕',
}

const validIconMap = icons.reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: cur,
  }),
  {}
)

export default function RoadmapPage({ item, isActive }: StackItemProps<HomeStateItemAbout>) {
  const user = useUserStore().user
  const refetch = useRefetch()
  const query = useQuery({
    suspense: false,
  })
  const [page, setPage] = useState(1)
  const expect = 50 * page
  const roadmapItems = query.review({
    where: {
      type: {
        _eq: types.item,
      },
    },
    limit: expect,
    order_by: [
      {
        reviews_aggregate: {
          avg: {
            vote: order_by.desc,
          },
        },
      },
      {
        authored_at: order_by.desc,
      },
    ],
  })

  const isLoading = typeof roadmapItems[0]?.text === 'undefined'

  const vote = useCallback((vote: number) => {
    if (!user) return userStore.promptLogin()
    upsertUserReview(
      {
        vote,
        user_id: user.id,
      },
      roadmapItems
    )
  }, [])

  const content = (
    <StackDrawer closable title="Roadmap">
      <PageContent>
        <YStack space="$8">
          <YStack paddingHorizontal="5%" space="$8">
            <YStack />

            <Paragraph fontWeight="800" size="$6">
              Roadmap
            </Paragraph>

            <Paragraph size="$6">Vote on things you want to see done.</Paragraph>
            <Paragraph size="$6">
              {icons.map((icon, i) => `${icon} ${descriptions[i]}      `)}
            </Paragraph>

            <Add items={roadmapItems} />

            <FlatList
              data={[
                ...roadmapItems.map((review) => {
                  const text = review.text || ''
                  const icon = text.match(emojiRegex)?.[0] || icons[0]
                  console.log('icon', text, icon)
                  return {
                    text,
                    icon: validIconMap[icon] || icons[0],
                    authored_at: review.authored_at,
                    votes: review.reviews_aggregate({}).aggregate?.count({
                      columns: ['vote' as any],
                    }),
                  }
                }),
                'LOAD_MORE',
              ]}
              renderItem={({ index, item, separators }) => {
                if (typeof item === 'string') {
                  if (roadmapItems.length < expect) {
                    return null
                  }
                  return <Button onPress={() => setPage((x) => x + 1)}>Load more</Button>
                }
                return (
                  <XStack space="$6" alignItems="center">
                    <XGroup scale={0.7} marginVertical={-5} flexDirection="column">
                      <Button
                        onPress={() => vote(1)}
                        borderRadius={0}
                        icon={<ChevronUp color="#777" size={16} />}
                      />
                      <Button
                        onPress={() => vote(-1)}
                        borderRadius={0}
                        icon={<ChevronDown color="#777" size={16} />}
                      />
                    </XGroup>
                    <Paragraph size="$8">{`${item.votes}`}</Paragraph>
                    <Paragraph>{item.icon}</Paragraph>
                    <Paragraph>{removeEmojis(item.text || '')}</Paragraph>
                  </XStack>
                )
              }}
            />

            <Spacer />
          </YStack>
        </YStack>
      </PageContent>
    </StackDrawer>
  )

  const lastContent = useLastValueWhen(() => content, isLoading)

  return lastContent
}

const emojiRegex = /\p{Emoji}/gu
const removeEmojis = (text: string) => text.replace(emojiRegex, '')

const Add = ({ items }: { items: review[] }) => {
  const user = useUserStore().user
  const [text, setText] = useState('')
  const [curIcon, setIcon] = useState(icons[0])
  return (
    <XStack space alignItems="center">
      <XGroup>
        {icons.map((icon) => (
          <Button
            themeInverse={icon === curIcon}
            onPress={() => {
              setIcon(icon)
            }}
            borderRadius={0}
            key={icon}
          >
            {icon}
          </Button>
        ))}
      </XGroup>
      <Input onChangeText={setText} placeholder="Add..." />
      <LinkButton
        promptLogin
        onPress={() => {
          if (!user) return userStore.promptLogin()
          upsertUserReview(
            {
              restaurant_id: ROADMAP_ID,
              user_id: user.id,
              type: types.item,
              text: `${validIconMap[curIcon] || icons[0]} ${text}`,
            },
            items
          )
        }}
      >
        Add
      </LinkButton>
    </XStack>
  )
}
