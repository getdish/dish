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
  tagInsert,
  tagUpsert,
} from '@dish/graph'
import {
  HStack,
  LoadingItems,
  Spacer,
  Text,
  Toast,
  VStack,
  useDebounceValue,
  useForceUpdate,
} from '@dish/ui'
import { RecoilRoot, Store, useRecoilStore } from '@dish/use-store'
import { capitalize, uniqBy } from 'lodash'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TextInput } from 'react-native'

import { emojiRegex } from '../../helpers/emojiRegex'
import { SmallButton } from '../../views/ui/SmallButton'
import { AdminListItem, AdminListItemProps } from './AdminListItem'
import { ColumnHeader } from './ColumnHeader'
import { useTagSelectionStore } from './SelectionStore'
import { VerticalColumn } from './VerticalColumn'

// whats still broken:
//   - "New" item
//   - "Create" form

export default graphql(function AdminTagsPage() {
  return (
    <RecoilRoot initializeState={null}>
      <AdminTagsPageContent />
    </RecoilRoot>
  )
})

class TagStore extends Store {
  selectedId = ''
  forceRefreshColumnByType = ''

  draft: TagRecord = {
    type: 'continent',
  }

  updateDraft(next: Partial<TagRecord>) {
    this.draft = { ...this.draft, ...next }
  }
}

const Search = memo(
  graphql(() => {
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
      <HStack overflow="hidden" width="100%" flex={1}>
        <ScrollView horizontal>
          <HStack>
            <VerticalColumn>
              <TagList row={0} type="continent" />
            </VerticalColumn>

            <VerticalColumn>
              <TagList row={1} type="country" />
            </VerticalColumn>

            <VerticalColumn>
              <TagList row={2} type="dish" />
            </VerticalColumn>

            <VerticalColumn title="Manage Lenses">
              <TagList type="lense" />
            </VerticalColumn>

            <VerticalColumn>
              <Text>Search Menus</Text>
              <Suspense fallback={<LoadingItems />}>
                <Search />
              </Suspense>
            </VerticalColumn>
          </HStack>
        </ScrollView>

        <VerticalColumn flex={3} minWidth={340}>
          <Suspense fallback={<LoadingItems />}>
            <TagEditColumn />
          </Suspense>
        </VerticalColumn>
      </HStack>
    </VStack>
  )
})

const TagList = memo(
  graphql(({ type, row }: { type: TagType; row: number }) => {
    const selectionStore = useTagSelectionStore()
    const lastRowSelection = selectionStore.selectedNames[row - 1]
    const [searchRaw, setSearch] = useState('')
    const search = useDebounceValue(searchRaw, 100)
    // const [newTag, setNewTag] = useState(null)
    const [parent] = query.tag({
      where: {
        name: { _eq: lastRowSelection },
      },
      limit: 1,
    })
    const parentId = parent?.id
    const [contentKey, setContentKey] = useState(0)
    const refresh = () => {
      setContentKey(Math.random())
    }

    console.log('contentKey', contentKey)

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
                style={[styles.textInput, { flex: 1, maxWidth: '50%' }]}
                onChangeText={(text) => {
                  setSearch(text)
                }}
              />
              <SmallButton
                onPress={() => {
                  tagInsert([
                    {
                      type,
                      name: `⭐️ new ${Math.random()}`,
                      icon: '',
                      parentId,
                    },
                  ])
                  refresh()
                }}
              >
                +
              </SmallButton>
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
            row={row}
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
      row,
      search,
      newTag,
      type,
      lastRowSelection,
    }: {
      search: string
      row: number
      type: TagType
      newTag?: Tag
      lastRowSelection: string
    }) => {
      const tagStore = useRecoilStore(TagStore)
      const selectionStore = useTagSelectionStore()
      const limit = 40
      const [page, setPage] = useState(1)
      const forceUpdate = useForceUpdate()

      const results = query.tag({
        where: {
          type: { _eq: type },
          ...(type !== 'continent' &&
            lastRowSelection && {
              parent: { name: { _eq: lastRowSelection } },
            }),
          ...(!!search && {
            name: {
              _ilike: `%${search}%`,
            },
          }),
        },
        limit: limit,
        offset: (page - 1) * limit,
        order_by: [
          {
            name: order_by.asc,
          },
        ],
      })

      const allResults = uniqBy(
        [{ id: 0, name: '' } as WithID<Tag>, ...results],
        (x) => x.name
      )

      useEffect(() => {
        if (tagStore.forceRefreshColumnByType === type) {
          refetch(results)
          setTimeout(() => {
            forceUpdate()
          }, 1000)
        }
      }, [tagStore.forceRefreshColumnByType])

      // didnt work with gqless
      // useEffect(() => {
      //   if (newTag) {
      //     console.warn('inserting new tag', newTag)
      //     // @ts-ignore
      //     results.push(newTag)
      //   }
      // }, [JSON.stringify(newTag ?? null)])

      return (
        <ScrollView style={{ paddingBottom: 100 }}>
          {allResults.map((tag, col) => {
            return (
              <TagListItem
                tagId={tag.id}
                col={col}
                row={row}
                onSelect={() => {
                  tagStore.selectedId = tag.id
                  selectionStore.setSelected([row, col])
                  selectionStore.setSelectedName(row, tag.name ?? '')
                }}
                isFormerlyActive={
                  selectionStore.selectedNames[row] === tag.name
                }
                isActive={
                  selectionStore.selectedIndices[0] == row &&
                  selectionStore.selectedIndices[1] == col
                }
              />
            )
          })}

          {results.length === limit && (
            <HStack
              height={32}
              padding={6}
              hoverStyle={{
                backgroundColor: '#f2f2f2',
              }}
              onPress={() => {
                setPage((x) => x + 1)
              }}
            >
              <Text>Next page</Text>
            </HStack>
          )}
        </ScrollView>
      )
    }
  )
)

const TagListItem = graphql(
  ({
    tagId,
    row,
    col,
    ...rest
  }: { tagId?: string; col: number; row: number } & Partial<
    AdminListItemProps
  >) => {
    if (tagId) {
      const tag = useTag(tagId)
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
          deletable={col > 0}
          editable={col > 0}
          {...rest}
        />
      )
    }

    return <AdminListItem text="All" />
  }
)

const TagEditColumn = memo(() => {
  const tagStore = useRecoilStore(TagStore)
  const [showCreate, setShowCreate] = useState(false)
  return (
    <VStack spacing="lg">
      <>
        <Text>Create</Text>
        <SmallButton onPress={() => setShowCreate((x) => !x)}>
          {showCreate ? 'Hide' : 'Create'}
        </SmallButton>
        {showCreate && (
          <>
            <TagCRUD
              tag={tagStore.draft}
              onChange={(x) => tagStore.updateDraft(x)}
            />
            <SmallButton
              onPress={async () => {
                console.log('upserting', tagStore.draft)
                const reply = await tagUpsert([tagStore.draft])
                console.log('got', reply)
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

const useTag = (id: string) => {
  return query.tag({
    where: {
      id: { _eq: id },
    },
    limit: 1,
  })[0]
}

const TagEdit = memo(
  graphql(() => {
    const tagStore = useRecoilStore(TagStore)
    if (tagStore.selectedId) {
      const tag = useTag(tagStore.selectedId)
      console.log('got now', tag)
      return (
        <TagCRUD
          tag={{
            name: tag.name,
            type: tag.type,
            icon: tag.icon,
          }}
          onChange={(x) => {
            for (const key in x) {
              tag[key] = x[key]
            }
            sleep(500).then(() => {
              refetch(tag)
            })
            Toast.show('Saved')
          }}
        />
      )
    }

    return null
  })
)

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

const TagCRUD = ({ tag, onChange }: { tag: Tag; onChange?: Function }) => {
  const [info, setInfo] = useState<{ name: string; description: string }[]>([])

  // get wiki info
  useEffect(() => {
    if (tag.name) {
      let unmounted = false
      const subNames = tag.name.split(' ')
      Promise.all([
        getWikiInfo(tag.name).then((description) => ({
          name: tag.name,
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

  console.log('edit tag', tag)
  return (
    <VStack
      margin={5}
      padding={10}
      borderColor="#eee"
      borderWidth={1}
      borderRadius={10}
      spacing={10}
    >
      <TableRow label="ID">
        <TextInput
          style={styles.textInput}
          onChange={(e) => onChange?.({ id: e.target['value'] })}
          defaultValue={tag.id}
          // onBlur={() => upsertDraft()}
        />
      </TableRow>

      <TableRow label="Name">
        <TextInput
          style={styles.textInput}
          onChange={(e) => onChange?.({ name: e.target['value'] })}
          defaultValue={tag.name}
          // onBlur={() => upsertDraft()}
        />
      </TableRow>

      <TableRow label="Type">
        <select
          onChange={(e) => {
            const id = e.target.options[e.target.selectedIndex].id
            onChange?.({ type: id })
          }}
        >
          <option id="continent">Continent</option>
          <option id="country">Country</option>
          <option id="dish">Dish</option>
          <option id="lense">Lense</option>
        </select>
      </TableRow>

      <TableRow label="Icon">
        <TextInput
          style={styles.textInput}
          onChange={(e) => onChange?.({ icon: e.target['value'] })}
          defaultValue={tag.icon ?? ''}
          // onBlur={() => upsertDraft()}
        />
        <ScrollView style={{ maxHeight: 330 }}>
          <HStack flexWrap="wrap">
            {foodIcons.map((icon, index) => (
              <VStack
                cursor="default"
                onPress={() => onChange?.({ icon })}
                padding={4}
                key={index}
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
          </HStack>
        </ScrollView>

        {info.length && (
          <ScrollView style={{ marginTop: 20, maxHeight: 300 }}>
            {info.map(({ name, description }) => {
              return (
                <VStack marginBottom={10} key={name}>
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
}

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
    const store = useTagSelectionStore()
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
          const isActive =
            store.selectedIndices[0] === 0 && index === store.selectedIndices[1]
          return (
            <VStack
              key={dish.id}
              onPress={() => {
                setTimeout(() => {
                  if (!isActive) {
                    store.setSelected([4, index])
                  }
                })
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
