import { Stack, Text, isWeb, styled } from '@tamagui/core';
export const Table = styled(Stack, {
    name: 'Table',
    tag: 'table',
});
export const TableRow = styled(Stack, {
    name: 'TableRow',
    tag: 'tr',
    alignSelf: 'stretch',
    flex: 1,
});
export const TableHead = styled(Stack, {
    name: 'TableHead',
    tag: 'thead',
    flexDirection: 'row',
    alignSelf: 'stretch',
    flex: 1,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
});
export const TableHeadCell = styled(Stack, {
    name: 'TableHeadCell',
    tag: 'th',
    display: isWeb ? 'table-head' : 'flex',
    flexDirection: 'row',
});
export const TableHeadText = styled(Text, {
    name: 'TableHeadText',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 2,
    paddingHorizontal: 8,
    marginLeft: -8,
    borderRadius: 10,
    maxWidth: '100%',
    ellipse: true,
    fontSize: 12,
});
export const TableCell = styled(Stack, {
    name: 'TableCell',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    tag: 'td',
    display: isWeb ? 'table-cell' : 'flex',
    paddingVertical: '$3',
    paddingHorizontal: '$2',
});
