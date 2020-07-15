import { fullyIdle, series } from '@dish/async'
import {
  Tag,
  TagRecord,
  TagType,
  graphql,
  order_by,
  query,
  tagDelete,
  tagInsert,
} from '@dish/graph'
import { RecoilRoot, Store, useRecoilStore } from '@dish/recoil-store'
import {
  HStack,
  LoadingItems,
  Spacer,
  StackProps,
  Text,
  Toast,
  VStack,
  useDebounceValue,
} from '@dish/ui'
import immer from 'immer'
import { capitalize, pick, uniqBy } from 'lodash'
import { Suspense, memo, useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import { ScrollView, StyleSheet, TextInput } from 'react-native'

import { emojiRegex } from '../../helpers/emojiRegex'
import { SmallButton } from '../../views/ui/SmallButton'

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

class Tags extends Store {
  selectedId = ''
  selectedIndices = [0, 0]
  selectedNames = [] as string[]

  draft: TagRecord = {
    type: 'continent',
  }

  setSelected(id: string, indices: [number, number]) {
    this.selectedId = id
    this.selectedIndices = indices
  }

  setSelectedName(row: number, name: string) {
    this.selectedNames = immer(this.selectedNames, (next) => {
      next[row] = name
    })
  }

  updateDraft(next: Partial<TagRecord>) {
    this.draft = { ...this.draft, ...next }
  }
}

const VerticalColumn = ({ children, ...props }: StackProps) => {
  return (
    <VStack flex={1} borderLeftColor="#eee" borderLeftWidth={1} {...props}>
      <Suspense fallback={<LoadingItems />}>{children}</Suspense>
    </VStack>
  )
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
    <VStack overflow="hidden" maxHeight="100vh" maxWidth="100vw">
      <HStack overflow="hidden" width="100%">
        <VerticalColumn>
          <TagList row={0} type="continent" />
        </VerticalColumn>

        <VerticalColumn>
          <TagList row={1} type="country" />
        </VerticalColumn>

        <VerticalColumn>
          <Suspense fallback={<LoadingItems />}>
            <TagList row={2} type="dish" />
          </Suspense>
        </VerticalColumn>

        <VerticalColumn>
          <Text>Search Menus</Text>
          <Suspense fallback={<LoadingItems />}>
            <Search />
          </Suspense>
        </VerticalColumn>

        <VerticalColumn>
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
    const store = useRecoilStore(Tags)
    const lastRowSelection = store.selectedNames[row - 1]
    const [searchRaw, setSearch] = useState('')
    const search = useDebounceValue(searchRaw, 100)
    const [parent] = query.tag({
      where: {
        name: { _eq: lastRowSelection },
      },
      limit: 1,
    })
    const parentId = parent.id

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
                }}
              >
                New
              </SmallButton>
            </HStack>
          }
        >
          {capitalize(type)} {lastRowSelection ? `(${lastRowSelection})` : ''}
        </ColumnHeader>
        <Suspense fallback={<LoadingItems />}>
          <TagListContent
            search={search}
            row={row}
            type={type}
            lastRowSelection={lastRowSelection}
          />
        </Suspense>
      </VStack>
    )
  })
)

const TagListContent = graphql(
  ({
    row,
    search,
    type,
    lastRowSelection,
  }: {
    search: string
    row: number
    type: TagType
    lastRowSelection: string
  }) => {
    const store = useRecoilStore(Tags)
    const limit = 200
    const [page, setPage] = useState(1)
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
    const allResults = uniqBy([{ id: 0, name: '' }, ...results], (x) => x.name)

    return (
      <ScrollView style={{ paddingBottom: 100 }}>
        {allResults.map((tag, index) => {
          return (
            <ListItem
              key={tag.id}
              row={row}
              col={index}
              tag={tag}
              type={type}
              isFormerlyActive={store.selectedNames[row] === tag.name}
              isActive={
                store.selectedIndices[0] == row &&
                store.selectedIndices[1] == index
              }
              deletable={index > 0}
              editable={index > 0}
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

const TagEditColumn = memo(() => {
  const store = useRecoilStore(Tags)
  return (
    <VStack spacing="lg">
      <>
        <Text>Create</Text>
        <TagCRUD tag={store.draft} onChange={(x) => store.updateDraft(x)} />
        <SmallButton
          onPress={() => {
            tagInsert([store.draft])
            Toast.show('Saved')
          }}
        >
          Save
        </SmallButton>
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

const TagEdit = memo(
  graphql(() => {
    const store = useRecoilStore(Tags)
    if (store.selectedId) {
      const [tag] = query.tag({
        where: {
          id: { _eq: store.selectedId },
        },
        limit: 1,
      })
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
          }}
        />
      )
    }

    return null
  })
)

const TagCRUD = ({ tag, onChange }: { tag: Tag; onChange?: Function }) => {
  console.log('edit tag', tag)
  return (
    <VStack
      margin={5}
      padding={10}
      borderColor="#eee"
      borderWidth={1}
      borderRadius={10}
    >
      <Text>ID</Text>
      <TextInput
        style={styles.textInput}
        onChange={(e) => onChange({ id: e.target['value'] })}
        defaultValue={tag.id}
        // onBlur={() => upsertDraft()}
      />
      <Text>Name</Text>
      <TextInput
        style={styles.textInput}
        onChange={(e) => onChange({ name: e.target['value'] })}
        defaultValue={tag.name}
        // onBlur={() => upsertDraft()}
      />
      <Text>Icon</Text>
      <TextInput
        style={styles.textInput}
        onChange={(e) => onChange({ icon: e.target['value'] })}
        defaultValue={tag.icon}
        // onBlur={() => upsertDraft()}
      />
      <select onChange={(e) => onChange({ type: e.target.value as any })}>
        <option id="continent">Continent</option>
        <option id="country">Country</option>
        <option id="dish">Dish</option>
      </select>
    </VStack>
  )
}

const ColumnHeader = ({ children, after }) => {
  return (
    <HStack
      minHeight={30}
      maxWidth="100%"
      overflow="hidden"
      borderBottomColor="#ddd"
      borderBottomWidth={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <Text paddingHorizontal={5} fontWeight="600" fontSize={13}>
        {children}
      </Text>
      <Spacer />
      {after}
    </HStack>
  )
}

const ListItem = memo(
  ({
    row,
    col,
    type,
    tag,
    isFormerlyActive,
    isActive,
    editable = true,
    deletable = false,
  }: {
    editable?: boolean
    deletable?: boolean
    row?: number
    type: TagType
    col?: number
    isActive: boolean
    tag: TagRecord
    isFormerlyActive?: boolean
  }) => {
    const store = useRecoilStore(Tags)
    const text = `${tag.icon ?? ''} ${tag.name}`.trim()
    const [isEditing, setIsEditing] = useState(false)
    const [hidden, setHidden] = useState(false)
    const lastTap = useRef(Date.now())
    const textInput = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
      if (isEditing) {
        return series([
          () => fullyIdle({ max: 40 }),
          () => {
            textInput.current?.focus()
            textInput.current?.select()
          },
        ])
      }
    }, [isEditing])

    useEffect(() => {
      if (!isActive) {
        setIsEditing(false)
      }
    }, [isActive])

    if (hidden) {
      return null
    }

    return (
      <HStack
        height={32}
        {...(!isActive &&
          !isFormerlyActive && {
            hoverStyle: {
              backgroundColor: '#f2f2f2',
            },
          })}
        onPress={() => {
          if (Date.now() - lastTap.current < 250) {
            if (editable) {
              setIsEditing(true)
            }
          } else {
            lastTap.current = Date.now()
            store.setSelected(tag.id, [row, col])
            store.setSelectedName(row, tag.name)
          }
        }}
        padding={6}
        alignItems="center"
        {...(isFormerlyActive && {
          backgroundColor: '#aaa',
        })}
        {...(isActive && {
          backgroundColor: 'blue',
        })}
      >
        {(() => {
          if (isEditing) {
            return (
              <TextInput
                ref={textInput as any}
                style={[
                  styles.textInput,
                  {
                    margin: -5,
                    padding: 5,
                    color: '#fff',
                  },
                ]}
                defaultValue={text as any}
                onBlur={(e) => {
                  setIsEditing(false)
                  const value = e.target['value']
                  if (emojiRegex.test(value)) {
                    const [icon, ...nameParts] = value.split(' ')
                    const name = nameParts.join(' ')
                    tag.icon = icon
                    tag.name = name
                  } else {
                    tag.name = value
                  }
                }}
              />
            )
          }

          return (
            <Text
              cursor="default"
              color={isActive ? '#fff' : '#000'}
              fontSize={16}
              ellipse
            >
              {text}
            </Text>
          )
        })()}

        <div style={{ flex: 1 }} />

        {deletable && (
          <VStack
            padding={4}
            onPress={(e) => {
              e.stopPropagation()
              if (confirm('Delete?')) {
                setHidden(true)
                tagDelete(tag)
              }
            }}
          >
            <X size={12} color="#999" />
          </VStack>
        )}
      </HStack>
    )
  }
)

const MenuItemsResults = memo(
  graphql(({ search }: { search: string }) => {
    const store = useRecoilStore(Tags)
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
                    store.setSelected(dish.id, [4, index])
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
