import { sleep } from '@dish/async'
import {
  Tag,
  TagRecord,
  TagType,
  WithID,
  graphql,
  order_by,
  query,
  refetch,
  tagDelete,
  tagUpsert,
} from '@dish/graph'
import {
  HStack,
  LoadingItems,
  Text,
  Toast,
  VStack,
  useDebounce,
  useDebounceValue,
  useForceUpdate,
} from '@dish/ui'
import { Store, useStore, useStoreSelector } from '@dish/use-store'
import { capitalize } from 'lodash'
import React, { Suspense, memo, useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, TextInput } from 'react-native'

import { emojiRegex } from '../../helpers/emojiRegex'
import { useQueryPaginated } from '../../hooks/useQueryPaginated'
import { SmallButton } from '../../views/ui/SmallButton'
import { AdminListItem, AdminListItemProps } from './AdminListItem'
import { ColumnHeader } from './ColumnHeader'
import { PaginationNav } from './PaginationNav'
import { VerticalColumn } from './VerticalColumn'

export default graphql(function AdminTagsPage() {
  return <AdminTagsPageContent />
})

class AdminTagStore extends Store {
  selectedId = ''
  selectedTagNames: string[] = []
  forceRefreshColumnByType = ''

  draft: TagRecord = {
    type: 'continent',
  }

  setDraft(next: Partial<TagRecord>) {
    this.draft = { ...this.draft, ...next }
  }

  setSelected({ id, col, name }: { id: string; col: number; name: string }) {
    this.selectedId = id
    this.selectedTagNames[col] = name
    this.selectedTagNames = [...this.selectedTagNames]
  }
}

const Search = memo(
  graphql<any>(() => {
    const [search, setSearch] = useState('')
    const searchDebounced = useDebounceValue(search, 200)
    return (
      <>
        <TextInput
          style={styles.textInput}
          onChange={(e) => setSearch(e.target['value'])}
          placeholder="Search all MenuItems"
        />
        <Suspense fallback={<LoadingItems />}>
          <MenuItemsResults search={searchDebounced} />
        </Suspense>
      </>
    )
  })
)

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
    <VStack overflow="hidden" maxHeight="100vh" maxWidth="100vw" width="100%">
      <HStack overflow="hidden" width="100%" height="100%" flex={1}>
        <ScrollView horizontal>
          <HStack>
            <VerticalColumn>
              <TagList column={0} type="continent" />
            </VerticalColumn>

            <VerticalColumn>
              <TagList column={1} type="country" />
            </VerticalColumn>

            <VerticalColumn>
              <TagList column={2} type="dish" />
            </VerticalColumn>

            <VerticalColumn title="Manage Lenses">
              <TagList column={3} type="lense" />
            </VerticalColumn>

            <VerticalColumn>
              <Text>Search Menus</Text>
              <Suspense fallback={<LoadingItems />}>
                <Search />
              </Suspense>
            </VerticalColumn>
          </HStack>
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
      </HStack>
    </VStack>
  )
})

const TagList = memo(
  graphql(({ type, column }: { type: TagType; column: number }) => {
    // const lastRowIndex = useRowStore({ id: 'tags', column: column - 1 }, x => x.row)
    const lastRowSelection =
      (useStoreSelector(
        AdminTagStore,
        (store) => store.selectedTagNames[column - 1] ?? ''
      ) as any) ?? ''

    const [searchRaw, setSearch] = useState('')
    const search = useDebounceValue(searchRaw, 100)
    // const [newTag, setNewTag] = useState(null)
    const [parent] = query.tag({
      where: {
        name: { _eq: lastRowSelection },
      },
      limit: 1,
    })
    const parentName = parent?.name
    const parentId = parent?.id
    const [contentKey, setContentKey] = useState(0)
    const refresh = () => {
      setContentKey(Math.random())
    }

    return (
      <VStack flex={1} maxHeight="100%">
        <ColumnHeader
          after={
            <HStack
              flex={1}
              spacing={10}
              alignItems="center"
              justifyContent="space-between"
            >
              <TextInput
                placeholder="Search..."
                style={[styles.textInput, { flex: 1, maxWidth: '90%' }]}
                onChangeText={(text) => {
                  setSearch(text)
                }}
              />
              {/* <SmallButton
                onPress={async () => {
                  const name = search ?? `0 new ${Math.random()}`
                  await tagInsert([
                    {
                      type,
                      name,
                      icon: '',
                      parentId,
                    },
                  ])
                  Toast.show(`Added ${name} under ${parentName}`)
                  refresh()
                }}
              >
                +
              </SmallButton> */}
            </HStack>
          }
        >
          {capitalize(type)} {lastRowSelection ? `(${lastRowSelection})` : ''}
        </ColumnHeader>
        <Suspense fallback={<LoadingItems />}>
          <TagListContent
            key={contentKey}
            search={search}
            // newTag={newTag}
            column={column}
            type={type}
            lastRowSelection={lastRowSelection}
          />
        </Suspense>
      </VStack>
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
      lastRowSelection: string
    }) => {
      const perPage = 50
      const { results, total, totalPages, page, setPage } = useQueryPaginated({
        perPage,
        query: query.tag,
        queryAggregate: query.tag_aggregate,
        params: {
          where: {
            type: { _eq: type },
            ...(type !== 'continent' &&
              type !== 'lense' &&
              lastRowSelection && {
                parent: { name: { _eq: lastRowSelection } },
              }),
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
      const forceUpdate = useForceUpdate()

      const allResults = [{ id: 0, name: '' } as WithID<Tag>, ...results]

      useEffect(() => {
        console.log(
          'tagStore.forceRefreshColumnByType',
          tagStore.forceRefreshColumnByType
        )
        if (tagStore.forceRefreshColumnByType === type) {
          const res = refetch(results)
          console.log('res', res)
          setTimeout(() => {
            forceUpdate()
          }, 1000)
        }
      }, [tagStore.forceRefreshColumnByType])

      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingBottom: 50 }}
        >
          <PaginationNav
            totalPages={totalPages}
            setPage={setPage}
            page={page}
          />
          <HStack
            paddingVertical={2}
            alignItems="center"
            justifyContent="center"
            borderBottomColor="#ddd"
            borderBottomWidth={1}
          >
            <Text opacity={0.5}>{total} total</Text>
          </HStack>
          <Suspense fallback={<LoadingItems />}>
            {allResults.map((tag, row) => {
              return (
                <TagListItem
                  key={tag.id ?? row}
                  id="tags"
                  tagId={tag.id}
                  row={row}
                  column={column}
                  onSelect={() => {
                    tagStore.setDraft({
                      parentId: tag.id,
                      type: 'dish',
                    })
                    tagStore.setSelected({
                      col: column,
                      id: tag.id,
                      name: tag.name ?? '',
                    })
                  }}
                />
              )
            })}
          </Suspense>
          <PaginationNav
            totalPages={totalPages}
            setPage={setPage}
            page={page}
          />
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
  }: { tagId?: string; column: number; row: number } & Partial<
    AdminListItemProps
  >) => {
    if (tagId) {
      const tag = queryTag(tagId)
      // be sure to get id
      tag.id
      const text = `${tag.icon ?? ''} ${tag.name}`.trim()
      return (
        <AdminListItem
          text={text}
          onDelete={() => {
            tagDelete(tag)
          }}
          onEdit={(text) => {
            setTagNameAndIcon(tag, text)
          }}
          column={column}
          row={row}
          id="tags"
          deletable={row > 0}
          editable={row > 0}
          {...rest}
        />
      )
    }

    return <AdminListItem id="tags" column={column} row={row} text="All" />
  }
)

const TagEditColumn = memo(() => {
  const tagStore = useStore(AdminTagStore)
  const [showCreate, setShowCreate] = useState(false)
  const setDraftDebounced = useDebounce((x) => tagStore.setDraft(x), 200)
  console.log('tagStore', tagStore.draft)

  return (
    <VStack spacing="lg">
      <>
        <Text>Create</Text>
        <SmallButton onPress={() => setShowCreate((x) => !x)}>
          {showCreate ? 'Hide' : 'Create'}
        </SmallButton>
        {showCreate && (
          <>
            <TagCRUD tag={tagStore.draft} onChange={setDraftDebounced} />
            <SmallButton
              onPress={async () => {
                console.log('upserting', tagStore.draft)
                const reply = await tagUpsert([tagStore.draft])
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
    </VStack>
  )
})

const queryTag = (id: string) => {
  return query.tag({
    where: {
      id: { _eq: id },
    },
    limit: 1,
  })[0]
}

const TagEdit = memo(
  graphql<any>(() => {
    const tagStore = useStore(AdminTagStore)
    const refetchTm = useRef(null)
    if (tagStore.selectedId) {
      const tag = queryTag(tagStore.selectedId)
      console.log('got now', tag)
      return (
        <TagCRUD
          key={tagStore.selectedId}
          tag={{
            id: tagStore.selectedId,
            name: tag.name,
            type: tag.type,
            parentId: tag.parentId,
            icon: tag.icon,
            alternates: parseJSONB(tag.alternates() ?? []),
          }}
          onChange={(x) => {
            for (const key in x) {
              tag[key] = x[key]
            }
            clearTimeout(refetchTm.current)
            refetchTm.current = setTimeout(() => {
              refetch(tag)
            }, 2000)
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
  }, [tag.name])

  return (
    <VStack
      margin={5}
      padding={10}
      borderColor="#eee"
      borderWidth={1}
      borderRadius={10}
      backgroundColor="#fff"
      spacing={10}
    >
      <TableRow label="Parent">
        <Text>Parent: {parentTag?.name}</Text>
        <SmallButton
          onPress={() => {
            onChange({
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
          defaultValue={tag.name}
        />
      </TableRow>

      <TableRow label="Alternate Names">
        <TextInput
          style={styles.textInput}
          onChange={(e) =>
            onChange?.({ alternates: e.target['value'].split(', ') })
          }
          defaultValue={(tag.alternates ?? []).join(', ')}
        />
      </TableRow>

      <TableRow label="Type">
        <select
          key={tag.type}
          defaultValue={tag.type}
          onChange={(e) => {
            const value = e.target.options[e.target.selectedIndex].value
            onChange?.({ type: value })
          }}
        >
          <option value="continent">Continent</option>
          <option value="country">Country</option>
          <option value="dish">Dish</option>
          <option value="lense">Lense</option>
        </select>
      </TableRow>

      <TableRow label="Icon">
        <TextInput
          style={styles.textInput}
          onChange={(e) => onChange?.({ icon: e.target['value'] })}
          defaultValue={tag.icon ?? ''}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <VStack flexWrap="wrap" maxHeight={140}>
            {foodIcons.map((icon, index) => (
              <VStack
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
              </VStack>
            ))}
          </VStack>
        </ScrollView>

        <TableRow label="Description">
          <TextInput
            style={styles.textInput}
            onChange={(e) => onChange?.({ description: e.target['value'] })}
            defaultValue={tag.description ?? ''}
          />
        </TableRow>

        {info.length && (
          <ScrollView style={{ marginTop: 20, maxHeight: 300 }}>
            {info.map(({ name, description }, index) => {
              return (
                <VStack
                  key={index}
                  marginBottom={10}
                  hoverStyle={{
                    backgroundColor: '#eee',
                  }}
                >
                  <Text fontWeight="600">{name}</Text>
                  <Text>{description ?? 'None found'}</Text>
                </VStack>
              )
            })}
          </ScrollView>
        )}
      </TableRow>
    </VStack>
  )
})

const TableRow = ({ label, children }: { label: string; children: any }) => {
  return (
    <VStack>
      <Text fontSize={13}>{label}</Text>
      {children}
    </VStack>
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
      <VStack flex={1}>
        {dishes.map((dish, index) => {
          return (
            <VStack
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
            </VStack>
          )
        })}
      </VStack>
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
