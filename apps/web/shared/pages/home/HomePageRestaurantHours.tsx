import { graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  SmallTitle,
  TableCell,
  TableCellProps,
  TableRow,
  VStack,
} from '@dish/ui'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

import { pageWidthMax, zIndexGallery } from '../../constants'
import { router } from '../../state/router'
import { StackViewCloseButton } from './StackViewCloseButton'
import { Table, TableHeadRow, TableHeadText } from './Table'
import { useRestaurantQuery } from './useRestaurantQuery'

export default memo(
  graphql(function HomePageRestaurantHours() {
    const params = router.curPage.params
    console.log('params', params)
    const restaurant = useRestaurantQuery(params.slug)
    const hours = restaurant.hours()

    return (
      <AbsoluteVStack
        fullscreen
        backgroundColor="rgba(0,0,0,0.5)"
        alignItems="center"
        justifyContent="center"
        zIndex={zIndexGallery}
      >
        <VStack
          width="80%"
          height="80%"
          backgroundColor="#fff"
          borderRadius={15}
          maxWidth={400}
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
                <SmallTitle fontWeight="600">
                  Hours - {restaurant.name}
                </SmallTitle>

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
                    return (
                      <TableRow key={i}>
                        <TableCell {...col0Props}>
                          {hour.hoursInfo.day}
                        </TableCell>
                        <TableCell {...col1Props}>
                          {hour.hoursInfo.hours}
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
  fontSize: 16,
}
