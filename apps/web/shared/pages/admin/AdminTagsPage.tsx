import { fullyIdle, series } from '@dish/async'
import {
  TagRecord,
  TagType,
  graphql,
  query,
  tagDelete,
  tagInsert,
} from '@dish/graph'
import { RecoilRoot, Store, useRecoilStore } from '@dish/recoil-store'
import {
  HStack,
  LoadingItems,
  StackProps,
  Text,
  VStack,
  useDebounceValue,
} from '@dish/ui'
import immer from 'immer'
import { capitalize, uniqBy } from 'lodash'
import { Suspense, memo, useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import { ScrollView, StyleSheet, TextInput } from 'react-native'

import { emojiRegex } from '../../helpers/emojiRegex'
import { SmallButton } from '../../views/ui/SmallButton'

export default graphql(function AdminTagsPage() {
  return (
    <RecoilRoot initializeState={null}>
      <AdminTagsPageContent />
    </RecoilRoot>
  )
})

class Tags extends Store {
  selected = [0, 0]
  selectedNames = [] as string[]

  draft: TagRecord = {
    type: 'continent',
  }

  setSelected(selected: [number, number]) {
    this.selected = selected
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
  const store = useRecoilStore(Tags)

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
          <Search />
        </VerticalColumn>

        <VerticalColumn>
          <Text>Create</Text>
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
              onChange={(e) => store.updateDraft({ id: e.target['value'] })}
              defaultValue={store.draft.id}
              // onBlur={() => upsertDraft()}
            />
            <Text>Name</Text>
            <TextInput
              style={styles.textInput}
              onChange={(e) => store.updateDraft({ name: e.target['value'] })}
              defaultValue={store.draft.name}
              // onBlur={() => upsertDraft()}
            />
            <Text>Icon</Text>
            <TextInput
              style={styles.textInput}
              onChange={(e) => store.updateDraft({ icon: e.target['value'] })}
              defaultValue={store.draft.icon}
              // onBlur={() => upsertDraft()}
            />
            <select
              onChange={(e) =>
                store.updateDraft({ type: e.target.value as any })
              }
            >
              <option id="continent">Continent</option>
              <option id="country">Country</option>
              <option id="dish">Dish</option>
            </select>
            <SmallButton
              onPress={() => {
                // upsertDraft({ type: 'continent' })
              }}
            >
              Clear
            </SmallButton>
            <SmallButton
            // onPress={() => upsertDraft()}
            >
              Create
            </SmallButton>
          </VStack>
        </VerticalColumn>
      </HStack>
    </VStack>
  )
})

const TagList = memo(
  graphql(({ type, row }: { type: TagType; row: number }) => {
    const store = useRecoilStore(Tags)
    const lastRowSelection = store.selectedNames[row - 1]
    const results = query.tag({
      where: {
        type: { _eq: type },
        ...(type !== 'continent' &&
          lastRowSelection && {
            parent: { name: { _eq: lastRowSelection } },
          }),
      },
      limit: 100,
    })

    const [parent] = query.tag({
      where: {
        name: { _eq: lastRowSelection },
      },
      limit: 1,
    })
    const parentId = parent.id
    const allResults = uniqBy([{ name: '' }, ...results], (x) => x.name)

    return (
      <VStack flex={1} maxHeight="100%">
        <ColumnHeader
          after={
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
              Add New
            </SmallButton>
          }
        >
          {capitalize(type)} {lastRowSelection ? `(${lastRowSelection})` : ''}
        </ColumnHeader>
        <ScrollView>
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
                  store.selected[0] == row && store.selected[1] == index
                }
                deletable
              />
            )
          })}
        </ScrollView>
      </VStack>
    )
  })
)

const ColumnHeader = ({ children, after }) => {
  return (
    <HStack
      height={30}
      borderBottomColor="#ddd"
      borderBottomWidth={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <Text fontWeight="600" fontSize={13}>
        {children}
      </Text>
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
    upsert,
  }: {
    editable?: boolean
    deletable?: boolean
    row?: number
    type: TagType
    col?: number
    isActive: boolean
    tag: TagRecord
    isFormerlyActive?: boolean
    upsert?: Function
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
            store.setSelected([row, col])
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
    })
    return (
      <VStack flex={1}>
        {dishes.map((dish, index) => {
          const isActive =
            store.selected[0] === 0 && index === store.selected[1]
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
