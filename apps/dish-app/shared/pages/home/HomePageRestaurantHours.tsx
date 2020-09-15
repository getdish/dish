import { graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  PageTitle,
  SmallTitle,
  Spacer,
  TableCell,
  TableCellProps,
  TableRow,
  Text,
  VStack,
} from '@dish/ui'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

import { bgLight } from '../../colors'
import { zIndexGallery } from '../../constants'
import { router } from '../../state/router'
import { StackViewCloseButton } from './StackViewCloseButton'
import { Table, TableHeadRow, TableHeadText } from './Table'
import { useRestaurantQuery } from './useRestaurantQuery'

export default memo(
  graphql(function HomePageRestaurantHours() {
    const params = router.curPage.params
    const restaurant = useRestaurantQuery(params.slug)
    const hours = restaurant.hours() ?? []
    const dayOfWeek = new Intl.DateTimeFormat(['en'], {
      weekday: 'short',
    }).format(new Date())

    const title = `${restaurant.name} Open Hours`

    return (
      <>
        <PageTitle>{title}</PageTitle>
        <AbsoluteVStack
          fullscreen
          backgroundColor="rgba(0,0,0,0.5)"
          alignItems="center"
          justifyContent="center"
          zIndex={zIndexGallery}
        >
          <VStack
            width="80%"
            backgroundColor="#fff"
            borderRadius={15}
            maxWidth={380}
            maxHeight={480}
            alignItems="center"
            position="relative"
            overflow="hidden"
            shadowColor="rgba(0,0,0,0.5)"
            shadowRadius={40}
          >
            <VStack width="100%" height="100%" flex={1}>
              <AbsoluteVStack top={5} right={26}>
                <StackViewCloseButton />
              </AbsoluteVStack>
              <ScrollView style={{ width: '100%' }}>
                <VStack padding={18} spacing="lg">
                  <SmallTitle fontWeight="600">{title}</SmallTitle>

                  <Table className="hide-when-small">
                    <TableHeadRow>
                      <TableCell {...col0Props}>
                        <TableHeadText>Day</TableHeadText>
                      </TableCell>

                      <TableCell {...col1Props}>
                        <TableHeadText>Hours</TableHeadText>
                      </TableCell>
                    </TableHeadRow>

                    {hours.map((hour, i) => {
                      const isToday = (hour.hoursInfo.day ?? '').startsWith(
                        dayOfWeek
                      )
                      return (
                        <TableRow
                          backgroundColor={isToday ? bgLight : 'transparent'}
                          key={i}
                        >
                          <TableCell fontWeight="600" {...col0Props}>
                            {hour.hoursInfo.day}
                          </TableCell>
                          <TableCell {...col1Props}>
                            <VStack>
                              {hour.hoursInfo.hours.map((text, i) => {
                                return (
                                  <Text
                                    {...(text === 'Closed' && {
                                      color: 'red',
                                      fontWeight: '700',
                                    })}
                                    key={i}
                                  >
                                    {text}
                                    {i < hour.hoursInfo.hours.length - 1 && (
                                      <Spacer size="sm" />
                                    )}
                                  </Text>
                                )
                              })}
                            </VStack>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </Table>
                </VStack>
              </ScrollView>
            </VStack>
          </VStack>
        </AbsoluteVStack>
      </>
    )
  })
)

const col0Props: TableCellProps = {
  fontSize: 16,
  width: '25%',
  minWidth: 110,
  textAlign: 'right',
  paddingHorizontal: 30,
}

const col1Props: TableCellProps = {
  fontSize: 14,
  flex: 1,
}
