import { graphql } from '@dish/graph'
import {
  Divider,
  HStack,
  Spacer,
  StackProps,
  Text,
  TextProps,
  VStack,
} from '@dish/ui'
import { sortBy } from 'lodash'
import React, { memo } from 'react'
import { HelpCircle } from 'react-feather'
import { Image } from 'react-native'

import { bgLight, lightGreen, lightYellow } from '../../colors'
import { omStatic, useOvermind } from '../../state/om'
import { tagDisplayName } from '../../state/tagDisplayName'
import { Paragraph } from './Paragraph'
import { TextStrong } from './TextStrong'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
import { useRestaurantQuery } from './useRestaurantQuery'

const Table = (props: StackProps) => <VStack {...props} />

const TableRow = (props: StackProps) => (
  <HStack alignSelf="stretch" flex={1} {...props} />
)

const TableCell = (props: StackProps) => (
  <HStack
    alignSelf="stretch"
    flex={1}
    padding={4}
    alignItems="center"
    {...props}
  />
)

const TableHeadRow = (props: StackProps) => (
  <HStack
    alignSelf="stretch"
    flex={1}
    borderBottomColor="#eee"
    borderBottomWidth={1}
    {...props}
  />
)

const TableHeadText = (props: TextProps) => (
  <Text
    backgroundColor="#eee"
    padding={2}
    paddingHorizontal={8}
    marginLeft={-8}
    borderRadius={10}
    maxWidth={52}
    ellipse
    fontSize={12}
    {...props}
  />
)

const col0Props: StackProps = {
  flex: 0,
  minWidth: 30,
}

const col2Props: StackProps = {
  justifyContent: 'flex-end',
}

const col3Props: StackProps = {
  justifyContent: 'flex-end',
}

const TextHighlight = (props: TextProps) => (
  <Text padding={2} margin={-2} borderRadius={6} {...props} />
)

export const RestaurantScoreBreakdown = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const sources = restaurant?.sources?.() ?? {}

    // TODO pass this in from above i think
    const tags = omStatic.state.home.lastActiveTags
    const reviewTags = sortBy(
      tags.filter((tag) => tag.name !== 'Gems'),
      (a) => (a.type === 'lense' ? 0 : a.type === 'dish' ? 2 : 1)
    )

    return (
      <HStack overflow="hidden" maxWidth="100%" paddingVertical={12}>
        <VStack>
          <Paragraph sizeLineHeight={1.1} color="rgba(0,0,0,0.65)">
            This restaurant has 152 reviews from 5 sources. It has{' '}
            <TextHighlight backgroundColor={lightGreen}>
              <TextStrong color="#000">+121</TextStrong> points from 23 dish
              reviewers
            </TextHighlight>{' '}
            and{' '}
            <TextHighlight backgroundColor={lightYellow}>
              <TextStrong color="#000">+89</TextStrong> points from 3 external
              sources
            </TextHighlight>{' '}
            - Yelp, DoorDash, and TripAdvisor.
          </Paragraph>

          <Spacer />

          <Table>
            <TableHeadRow>
              <TableCell {...col0Props}></TableCell>

              <TableCell>
                <TableHeadText>Source</TableHeadText>
              </TableCell>

              <TableCell {...col2Props}>
                <TableHeadText marginRight={5}>Weight</TableHeadText>
                <HelpCircle
                  size={14}
                  color={'rgba(0,0,0,0.3)'}
                  style={{ margin: -2 }}
                />
              </TableCell>

              <TableCell {...col3Props}>
                <TableHeadText>Points</TableHeadText>
              </TableCell>
            </TableHeadRow>

            {Object.keys(sources).map((source, i) => {
              const item = sources[source]
              if (!item) return null
              const info = thirdPartyCrawlSources[source]
              return (
                <React.Fragment key={source}>
                  <TableRow>
                    <TableCell {...col0Props}>
                      {info?.image ? (
                        <Image
                          source={info.image}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 100,
                          }}
                        />
                      ) : null}
                    </TableCell>

                    <TableCell>
                      <Text fontSize={14} opacity={0.65}>
                        {info?.name ?? source}
                      </Text>
                    </TableCell>

                    <TableCell {...col2Props}>
                      <Text fontSize={14} opacity={0.65}>
                        {i / 4}
                      </Text>
                    </TableCell>

                    <TableCell {...col3Props}>
                      <Text fontSize={13}>{+(item.rating ?? 0) * 10}</Text>
                    </TableCell>
                  </TableRow>

                  {/* indented rows - breakdown */}
                  {reviewTags.map((tag) => (
                    <TableRow height={20} key={tag.name + tag.type}>
                      <TableCell {...col0Props} />

                      <TableCell>
                        <VStack
                          className="dotted-line"
                          width={10}
                          marginRight={5}
                        />
                        <Text fontSize={12} opacity={0.5}>
                          {tagDisplayName(tag)}
                        </Text>
                      </TableCell>

                      <TableCell></TableCell>

                      <TableCell {...col3Props}>
                        <Text opacity={0.5} fontSize={12}>
                          {(+(item.rating ?? 0) * 10) / reviewTags.length}
                        </Text>
                      </TableCell>
                    </TableRow>
                  ))}

                  <Spacer size="sm" />
                </React.Fragment>
              )
            })}

            <TableRow borderTopColor="#eee" borderTopWidth={1}>
              <TableCell {...col0Props}></TableCell>
              <TableCell></TableCell>
              <TableCell {...col3Props}>294</TableCell>
            </TableRow>
          </Table>
        </VStack>
      </HStack>
    )
  })
)
