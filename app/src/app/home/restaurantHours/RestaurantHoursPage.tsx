import { graphql } from '@dish/graph'
import {
  Modal,
  Spacer,
  Table,
  TableCell,
  TableCellProps,
  TableHeadRow,
  TableHeadText,
  TableRow,
  Text,
  YStack,
} from '@dish/ui'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

import { bgLight } from '../../../constants/colors'
import { dateTimeFormat } from '../../../helpers/dateTimeFormat'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { router } from '../../../router'
import { homeStore } from '../../homeStore'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SmallTitle } from '../../views/SmallTitle'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { PageTitle } from '../PageTitle'

export default memo(
  graphql(function RestaurantHoursPage(props: any) {
    const params = router.curPage.params
    const [restaurant] = queryRestaurant(params.slug)
    if (!restaurant) {
      return null
    }
    const hours = restaurant.hours ?? []
    const dayOfWeek = dateTimeFormat(new Date(), {
      weekday: 'short',
    })
    const title = `${restaurant.name} Open Hours`

    return (
      <>
        <PageTitle title={title} />
        <Modal
          visible
          onDismiss={() => {
            homeStore.up()
          }}
          width={380}
          maxHeight={480}
        >
          <PaneControlButtons>
            <StackViewCloseButton />
          </PaneControlButtons>
          <YStack width="100%" height="100%" flex={1}>
            <ScrollView style={{ width: '100%' }}>
              <YStack padding={18} spacing="lg">
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
                    if (!hour.hoursInfo) {
                      return null
                    }
                    const isToday = (hour.hoursInfo.day ?? '').startsWith(dayOfWeek)
                    return (
                      <TableRow backgroundColor={isToday ? '$bg2' : 'transparent'} key={i}>
                        <TableCell fontWeight="600" {...col0Props}>
                          {hour.hoursInfo.day}
                        </TableCell>
                        <TableCell {...col1Props}>
                          <YStack>
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
                                  {i < hour.hoursInfo.hours.length - 1 && <Spacer size="sm" />}
                                </Text>
                              )
                            })}
                          </YStack>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </Table>
              </YStack>
            </ScrollView>
          </YStack>
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
