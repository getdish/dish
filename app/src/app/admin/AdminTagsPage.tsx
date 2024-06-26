import { queryTag } from '../../queries/queryTag'
import { useQueryPaginated } from '../hooks/useQueryPaginated'
import { PaginationNav } from '../views/PaginationNav'
import { SmallButton } from '../views/SmallButton'
import { AdminListItem, AdminListItemProps } from './AdminListItem'
import { ColumnHeader } from './ColumnHeader'
import { VerticalColumn } from './VerticalColumn'
import {
  Tag,
  TagRecord,
  TagType,
  graphql,
  mutate,
  order_by,
  query,
  setCache,
  tag,
  tagDelete,
  tagUpsert,
  useRefetch,
} from '@dish/graph'
import {
  LoadingItems,
  Text,
  Toast,
  XStack,
  YStack,
  useDebounce,
  useDebounceValue,
} from '@dish/ui'
import { Store, useStore, useStoreSelector } from '@tamagui/use-store'
import { capitalize } from 'lodash'
import React, { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TextInput } from 'react-native'

const allTagsTag = { id: '', name: 'all', type: 'lense' } as const

export default graphql(function AdminTagsPage() {
  return <AdminTagsPageContent />
})

class AdminTagStore extends Store {
  showCreate = false
  selectedId = ''
  selectedByColumn: { name: string; type: TagType }[] = [allTagsTag]
  forceRefreshColumnByType = ''

  draft: TagRecord = {
    type: 'continent',
  }

  setShowCreate(next: boolean) {
    this.showCreate = next
  }

  setDraft(next: Partial<TagRecord>) {
    this.draft = { ...this.draft, ...next }
  }

  setSelected({
    id,
    col,
    name,
    type,
  }: {
    id: string
    col: number
    name: string
    type: TagType
  }) {
    console.log('setting selected', name, type, id)
    this.selectedId = id
    this.selectedByColumn[col] = { name, type }
    this.selectedByColumn = [...this.selectedByColumn]
  }
}

const AdminTagsPageContent = graphql(() => {
  // useEffect(() => {
  //   activeByRow[active[0]] = active[1]
  //   setSelectedByRow(activeByRow)
  // }, [...active])

  // useEffect(() => {
  //   const [row, col] = active
  //   const next = [continent, country, dish][row][col]
  //   if (next) {
  //     // setDraft(next)
  //   }
  // }, [active])

  return (
    <YStack overflow="hidden" maxHeight="100vh" maxWidth="100vw" width="100%">
      <XStack overflow="hidden" width="100%" height="100%" flex={1}>
        <ScrollView horizontal>
          <XStack>
            <VerticalColumn>
              <TagList column={0} />
            </VerticalColumn>

            <VerticalColumn>
              <TagList column={1} />
            </VerticalColumn>

            <VerticalColumn>
              <TagList column={2} />
            </VerticalColumn>

            <VerticalColumn>
              <TagList column={3} />
            </VerticalColumn>

            {/* <VerticalColumn title="Manage Lenses">
              <TagList column={3} type="lense" />
              <VerticalColumn title="Manage Filters">
              <TagList column={3} type="filter" />
              </VerticalColumn>
            </VerticalColumn> */}

            {/* <VerticalColumn>
              <Text>Search Menus</Text>
              <Suspense fallback={<LoadingItems />}>
                <Search />
              </Suspense>
            </VerticalColumn> */}
          </XStack>
        </ScrollView>

        <VerticalColumn
          height="100%"
          backgroundColor="#fafafa"
          shadowColor="#000"
          shadowRadius={4}
          shadowOpacity={0.2}
          minHeight="100vh"
          maxHeight="100vh"
          flex={2}
          minWidth={280}
          padding={5}
        >
          <ScrollView style={{ height: '100%', maxHeight: '100%' }}>
            <Suspense fallback={<LoadingItems />}>
              <TagEditColumn />
            </Suspense>
          </ScrollView>
        </VerticalColumn>
      </XStack>
    </YStack>
  )
})

const TagList = memo(
  graphql(({ column }: { column: number }) => {
    const lastRowSelection: any =
      useStoreSelector(
        AdminTagStore,
        useCallback((store) => store.selectedByColumn[column - 1] ?? '', [])
      ) ?? ''

    const type = lastRowSelection.type ?? 'root'
    const [searchRaw, setSearch] = useState('')
    const store = useStore(AdminTagStore)
    const search = useDebounceValue(searchRaw, 100)

    return (
      <YStack flex={1} maxHeight="100%">
        <ColumnHeader
          after={
            <XStack flex={1} space={10} alignItems="center" justifyContent="space-between">
              <TextInput
                placeholder="Search..."
                style={[styles.textInput, { flex: 1, maxWidth: '70%' }]}
                onChangeText={(text) => {
                  setSearch(text)
                }}
              />
              <SmallButton
                onPress={async () => {
                  store.setDraft({ type })
                  store.setShowCreate(true)
                }}
              >
                +
              </SmallButton>
            </XStack>
          }
        >
          {capitalize(type)} {lastRowSelection ? `(${lastRowSelection.name})` : ''}
        </ColumnHeader>
        <Suspense fallback={<LoadingItems />}>
          <TagListContent
            key={lastRowSelection}
            search={search}
            // newTag={newTag}
            column={column}
            type={type}
            lastRowSelection={lastRowSelection}
          />
        </Suspense>
      </YStack>
    )
  })
)

const TagListContent = memo(
  graphql(
    ({
      column,
      search,
      newTag,
      type,
      lastRowSelection,
    }: {
      search: string
      column: number
      type: TagType
      newTag?: Tag
      lastRowSelection: { name: string; type: TagType }
    }) => {
      const refetch = useRefetch()
      const perPage = 50
      const { results, total, totalPages, page, setPage } = useQueryPaginated({
        perPage,
        query: query.tag,
        queryAggregate: query.tag_aggregate,
        params: {
          where: {
            ...(lastRowSelection &&
              lastRowSelection?.name !== 'all' && {
                parent: {
                  name: { _eq: lastRowSelection.name },
                  type: { _eq: type },
                },
              }),
            // @ts-ignore
            ...(!lastRowSelection && {
              type: {
                _eq: 'null',
              },
            }),
            ...(!lastRowSelection
              ? column === 0 && {
                  type: {
                    _eq: 'root',
                  },
                }
              : null),
            ...(!!search && {
              name: {
                _ilike: `%${search}%`,
              },
            }),
          },
          order_by: [
            {
              name: order_by.asc,
            },
          ],
        },
      })
      const tagStore = useStore(AdminTagStore)

      const allResults = column === 0 ? [allTagsTag as tag, ...results] : results

      // refetch on every re-render so we dont have stale reads from gqty
      useEffect(() => {
        console.log('refertching')
        // refetchAll()
        refetch(results).catch(console.error)
      }, [lastRowSelection])

      useEffect(() => {
        if (tagStore.forceRefreshColumnByType === type) {
          // refetchAll()
          refetch(results).catch(console.error)
          // console.log('res', res)
          // setTimeout(() => {
          //   forceUpdate()
          // }, 1000)
        }
      }, [tagStore.forceRefreshColumnByType])

      return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: 50 }}>
          <XStack
            paddingVertical={2}
            alignItems="center"
            justifyContent="center"
            borderBottomColor="#ddd"
            borderBottomWidth={1}
          >
            <Text opacity={0.5}>{total} total</Text>
          </XStack>
          <PaginationNav totalPages={totalPages} setPage={setPage} page={page} />
          <Suspense fallback={<LoadingItems />}>
            {allResults.map((tag, row) => {
              const selection = {
                col: column,
                id: tag.id,
                type: tag.type as TagType,
                name: tag.name ?? '',
                description: tag.description,
              }
              return (
                <TagListItem
                  key={tag.id ?? row}
                  id="tags"
                  tagId={tag.id}
                  row={row}
                  column={column}
                  onSelect={() => {
                    console.log('on slect', column, tag)
                    tagStore.setDraft({
                      parentId: tag.id,
                      type: 'dish',
                    })
                    tagStore.setSelected(selection)
                  }}
                />
              )
            })}
          </Suspense>
          <PaginationNav totalPages={totalPages} setPage={setPage} page={page} />
        </ScrollView>
      )
    }
  )
)

const TagListItem = graphql(
  ({
    tagId,
    row,
    column,
    ...rest
  }: {
    tagId?: string
    column: number
    row: number
  } & Partial<AdminListItemProps>) => {
    if (tagId) {
      const [tag] = queryTag(tagId)
      // be sure to get id
      tag.id
      const text = `${tag.icon ?? ''} ${tag.name}`.trim()
      return (
        <AdminListItem
          text={text}
          onDelete={() => {
            // @ts-ignore
            tagDelete(tag)
          }}
          onEdit={(text) => {
            // @ts-ignore
            setTagNameAndIcon(tag, text)
          }}
          column={column}
          row={row}
          id="tags"
          deletable
          editable
          {...rest}
        />
      )
    }

    return <AdminListItem id="tags" column={column} row={row} text="All" {...rest} />
  }
)

const TagEditColumn = memo(() => {
  const tagStore = useStore(AdminTagStore)
  const setDraftDebounced = useDebounce((x) => tagStore.setDraft(x), 200)

  const refetch = useRefetch()

  return (
    <YStack space="$6">
      <>
        <Text>Create</Text>
        <SmallButton onPress={() => tagStore.setShowCreate(!tagStore.showCreate)}>
          {tagStore.showCreate ? 'Hide' : 'Create'}
        </SmallButton>
        {tagStore.showCreate && (
          <>
            <TagCRUD tag={tagStore.draft as Tag} onChange={setDraftDebounced} />
            <SmallButton
              onPress={async () => {
                console.log('upserting', tagStore.draft)
                const reply = await tagUpsert([tagStore.draft])

                refetch(tagStore.draft)
                console.log('reply', reply)
                Toast.show('Saved')
                tagStore.forceRefreshColumnByType = tagStore.draft.type ?? ''
              }}
            >
              Save
            </SmallButton>
          </>
        )}
      </>

      <>
        <Text>Edit</Text>
        <Suspense fallback={<LoadingItems />}>
          <TagEdit />
        </Suspense>
      </>
    </YStack>
  )
})

const TagEdit = memo(
  graphql((props: any) => {
    const tagStore = useStore(AdminTagStore)

    if (tagStore.selectedId) {
      const [tag] = queryTag(tagStore.selectedId)
      const fullTag = {
        id: tagStore.selectedId,
        name: tag.name,
        description: tag.description,
        type: tag.type,
        parentId: tag.parentId,
        icon: tag.icon,
        alternates: parseJSONB(tag.alternates ?? []),
        rgb: parseJSONB(tag.rgb ?? []),
      } as Tag
      return (
        <TagCRUD
          key={tagStore.selectedId}
          tag={fullTag}
          onChange={async (x) => {
            const tagMutation = await mutate(
              // @ts-ignore
              (mutation, { assignSelections }) => {
                const res = mutation.update_tag_by_pk({
                  pk_columns: {
                    id: tagStore.selectedId,
                  },
                  _set: x,
                })
                assignSelections(tag, res)
                return res
              }
            )
            setCache(tag, tagMutation)
            Toast.show('Saved')
          }}
        />
      )
    }

    return null
  })
)

const parseJSONB = (x: any) => {
  if (typeof x === 'string') {
    return JSON.parse(x)
  }
  return x
}

const emojiRegex = /\p{Emoji}/u

const setTagNameAndIcon = (tag: Tag, text: string) => {
  if (emojiRegex.test(text)) {
    const [icon, ...nameParts] = text.split(' ')
    const name = nameParts.join(' ')
    tag.icon = icon
    tag.name = name
  } else {
    tag.name = text
  }
}

const getWikiInfo = (term: string) => {
  return fetch(
    `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(
      term
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      const pages = data.query.pages
      const page = Object.keys(pages).find((k) => k !== '-1')
      if (page) {
        return pages[page].extract
      }
    })
}

type TagCRUDProps = { tag: Tag; onChange?: Function }

const TagCRUD = (props: TagCRUDProps) => {
  return (
    <Suspense fallback={null}>
      <TagCRUDContent {...props} />
    </Suspense>
  )
}

const TagCRUDContent = graphql(({ tag, onChange }: TagCRUDProps) => {
  const parentTag = tag.parentId
    ? query.tag({
        where: {
          id: {
            _eq: tag.parentId,
          },
        },
      })[0]
    : null

  const [info, setInfo] = useState<{ name: string; description: string }[]>([])

  // get wiki info
  useEffect(() => {
    if (tag.name) {
      let unmounted = false
      const subNames = tag.name.split(' ')
      Promise.all([
        getWikiInfo(tag.name).then((description) => ({
          name: tag.name ?? '',
          description,
        })),
        ...(subNames.length > 1
          ? subNames.map((name) =>
              getWikiInfo(name).then((description) => ({ name, description }))
            )
          : []),
      ]).then((results) => {
        if (!unmounted) {
          setInfo(results)
        }
      })

      return () => {
        unmounted = true
      }
    }
    return undefined
  }, [tag.name])

  return (
    <YStack
      margin={5}
      padding={10}
      borderColor="#eee"
      borderWidth={1}
      borderRadius={10}
      backgroundColor="#fff"
      space={10}
    >
      <TableRow label="ID">
        <Text opacity={0.5}>{tag.id}</Text>
      </TableRow>

      <TableRow label="Parent">
        <Text opacity={0.5}>Parent: {parentTag?.name}</Text>
        <SmallButton
          onPress={() => {
            onChange?.({
              parentId: null,
            })
          }}
        >
          Clear
        </SmallButton>
      </TableRow>

      <TableRow label="Name">
        <TextInput
          style={styles.textInput}
          onChange={(e) => onChange?.({ name: e.target['value'] })}
          defaultValue={tag.name ?? ''}
        />
      </TableRow>

      <TableRow label="Alternate Names">
        <TextInput
          style={styles.textInput}
          onChange={(e) => onChange?.({ alternates: e.target['value'].split(', ') })}
          defaultValue={(tag.alternates ?? []).join(', ')}
        />
      </TableRow>

      <TableRow label="Type">
        <select
          key={tag.type}
          defaultValue={tag.type ?? ''}
          onChange={(e) => {
            const value = e.target.options[e.target.selectedIndex].value
            onChange?.({ type: value })
          }}
        >
          <option value="root">Root</option>
          <option value="continent">Continent</option>
          <option value="country">Country</option>
          <option value="dish">Dish</option>
          <option value="filter">Filter</option>
          <option value="lense">Lense</option>
        </select>
      </TableRow>

      {tag.type === 'lense' && (
        <TableRow label="RGB">
          <TextInput
            style={styles.textInput}
            onChange={(e) => {
              onChange?.({
                rgb: e.target['value'].split(',').map((x) => +x.trim()),
              })
            }}
            defaultValue={(tag.rgb ?? [0, 0, 0]).join(', ')}
          />
        </TableRow>
      )}

      <TableRow label="Icon">
        <TextInput
          key={tag.icon}
          style={styles.textInput}
          onChange={(e) => onChange?.({ icon: e.target['value'] })}
          defaultValue={tag.icon ?? ''}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <YStack flexWrap="wrap" maxHeight={140}>
            {foodIcons.map((icon, index) => (
              <YStack
                key={index}
                cursor="default"
                onPress={() => onChange?.({ icon })}
                padding={4}
                borderRadius={5}
                hoverStyle={{
                  backgroundColor: '#eee',
                }}
              >
                <Text lineHeight={24} fontSize={26}>
                  {icon}
                </Text>
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      </TableRow>

      <TableRow label="ParentID">
        <TextInput
          style={styles.textInput}
          onChange={(e) => onChange?.({ parentId: e.target['value'] })}
          defaultValue={tag.parentId}
        />
      </TableRow>

      <TableRow label="Description">
        <TextInput
          style={styles.textInput}
          onChange={(e) => onChange?.({ description: e.target['value'] })}
          defaultValue={tag.description ?? ''}
        />
        {!!info.length && (
          <ScrollView style={{ marginTop: 20, maxHeight: 300 }}>
            {info.map(({ name, description }, index) => {
              return (
                <YStack
                  key={index}
                  marginBottom={10}
                  hoverStyle={{
                    backgroundColor: '#eee',
                  }}
                >
                  <Text fontWeight="600">{name}</Text>
                  <Text>{description ?? 'None found'}</Text>
                </YStack>
              )
            })}
          </ScrollView>
        )}
      </TableRow>
    </YStack>
  )
})

const TableRow = ({ label, children }: { label: string; children: any }) => {
  return (
    <YStack marginBottom={10}>
      <Text fontSize={13}>{label}</Text>
      {children}
    </YStack>
  )
}

const MenuItemsResults = memo(
  graphql(({ search }: { search: string }) => {
    const dishes = query.tag({
      where: { name: { _ilike: search } },
      limit: 100,
      order_by: [
        {
          name: order_by.asc,
        },
      ],
    })
    return (
      <YStack flex={1}>
        {dishes.map((dish, index) => {
          return (
            <YStack
              key={dish.id}
              onPress={() => {
                // setTimeout(() => {
                //   if (!isActive) {
                //     store.setSelected([4, index])
                //   }
                // })
              }}
            >
              <Text>{dish.name}</Text>
            </YStack>
          )
        })}
      </YStack>
    )
  })
)

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
})

const foodIcons = [
  '🥪',
  '🌭',
  '🥙',
  '🧆',
  '🌯',
  '🥗',
  '🍲',
  '🍜',
  '🍝',
  '🥘',
  '🍔',
  '🌮',
  '🍟',
  '🍗',
  '🍖',
  '🥩',
  '🍛',
  '🍣',
  '🍱',
  '🥟',
  '🍘',
  '🍚',
  '🍈',
  '🍑',
  '🍓',
  '🍒',
  '🍌',
  '🍎',
  '🥭',
  '🥝',
  '🍉',
  '🍊',
  '🍍',
  '🍋',
  '🥥',
  '🍇',
  '🍓',
  '🍕',
  '🌶',
  '🍿',
  '🦪',
  '🍙',
  '🍤',
  '🍡',
  '🥧',
  '🥓',
  '🥚',
  '🧀',
  '🍆',
  '🥑',
  '🥦',
  '🥬',
  '🥒',
  '🌽',
  '🥕',
  '🍠',
  '🥔',
  '🧅',
  '🧄',
  '🥐',
  '🥯',
  '🍞',
  '🥖',
  '🥨',
  '🧇',
  '🥞',
  '🎂',
  '🍰',
  '🍩',
  '🍦',
  '🍪',
  '🦴',
  '🥫',
  '🍥',
  '🥮',
  '🍢',
  '🍧',
  '🧁',
  '🍨',
  '🍺',
  '🍷',
  '🍶',
  '🍸',
  '🥃',
  '🍾',
]
