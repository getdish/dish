import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { HStack, StackProps, VStack } from './Stacks'
import { Text, TextProps } from './Text'

export type TableProps = StackProps

export const Table = (props: StackProps) => <VStack {...props} />

Table.staticConfig = extendStaticConfig(VStack, {})

const tableRowDefaultProps: StackProps = {
  alignSelf: 'stretch',
  flex: 1,
}

export type TableRowProps = StackProps

export const TableRow = (props: TableRowProps) => (
  <HStack {...tableRowDefaultProps} {...props} />
)

TableRow.staticConfig = extendStaticConfig(HStack, {
  defaultStyle: tableRowDefaultProps,
})

const tableCellDefaultProps: StackProps = {
  alignSelf: 'stretch',
  flex: 1,
  padding: 4,
  alignItems: 'center',
}

export type TableCellProps = StackProps

export const TableCell = (props: TableCellProps) => (
  <HStack {...tableCellDefaultProps} {...props} />
)

TableCell.staticConfig = extendStaticConfig(HStack, {
  defaultStyle: tableCellDefaultProps,
})

const tableHeadRowDefaultProps: StackProps = {
  alignSelf: 'stretch',
  flex: 1,
  borderBottomColor: '#eee',
  borderBottomWidth: 2,
}

export type TableHeadRowProps = StackProps

export const TableHeadRow = (props: TableHeadRowProps) => (
  <HStack {...tableHeadRowDefaultProps} {...props} />
)

TableHeadRow.staticConfig = extendStaticConfig(HStack, {
  defaultStyle: tableHeadRowDefaultProps,
})

const tableHeadTextDefaultProps: TextProps = {
  backgroundColor: '#eee',
  padding: 2,
  paddingHorizontal: 8,
  marginLeft: -8,
  borderRadius: 10,
  maxWidth: '100%',
  ellipse: true,
  fontSize: 12,
}

export type TableHeadTextProps = TextProps

export const TableHeadText = (props: TableHeadTextProps) => (
  <Text {...tableHeadTextDefaultProps} {...props} />
)

TableHeadText.staticConfig = extendStaticConfig(Text, {
  defaultStyle: tableHeadTextDefaultProps,
})
