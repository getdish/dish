import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  Modal,
  PageTitle,
  SmallTitle,
  Spacer,
  Table,
  TableCell,
  TableCellProps,
  TableHeadRow,
  TableHeadText,
  TableRow,
  Text,
  VStack,
} from 'snackui'

import { bgLight } from '../../colors'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { omStatic } from '../../state/omStatic'
import { router } from '../../state/router'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'

export default memo(
  graphql<any>(function HomePageRestaurantHours() {
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
        <Modal
          onDismiss={() => {
            omStatic.actions.home.up()
          }}
          width={380}
          maxHeight={480}
        >
          <VStack width="100%" height="100%" flex={1}>
            <AbsoluteVStack top={5} right={30}>
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
        </Modal>
      </>
    )
  })
)

const col0Props: TableCellProps = {
  selectable: true,
  fontSize: 16,
  width: '25%',
  minWidth: 110,
  textAlign: 'right',
  paddingHorizontal: 30,
}

const col1Props: TableCellProps = {
  selectable: true,
  fontSize: 14,
  flex: 1,
}
