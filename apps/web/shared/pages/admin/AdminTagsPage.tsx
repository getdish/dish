import { TagRecord, TagType, graphql, query } from '@dish/graph'
import { RecoilRoot, Store, useRecoilStore } from '@dish/recoil-store'
import {
  HStack,
  LoadingItems,
  Spacer,
  StackProps,
  Text,
  VStack,
  useDebounceValue,
} from '@dish/ui'
import { Suspense, memo, useRef, useState } from 'react'
import { ScrollView, StyleSheet, TextInput } from 'react-native'

import { SmallButton } from '../../views/ui/SmallButton'

class Tags extends Store {
  selected = [0, 0]

  selections = {
    continent: null,
    country: null,
    dish: null,
  }

  draft: TagRecord = {
    type: 'continent',
  }

  setSelected(selected: [number, number]) {
    this.selected = selected
  }

  updateDraft(next: Partial<TagRecord>) {
    this.draft = { ...this.draft, ...next }
  }
}

export default graphql(function AdminTagsPage() {
  return (
    <RecoilRoot initializeState={null}>
      <AdminTagsPageContent />
    </RecoilRoot>
  )
})

const VerticalColumn = ({ children, ...props }: StackProps) => {
  return (
    <VStack flex={1} borderLeftColor="#eee" borderLeftWidth={1} {...props}>
      <Suspense fallback={<LoadingItems />}>{children}</Suspense>
    </VStack>
  )
}

const AdminTagsPageContent = graphql(() => {
  const store = useRecoilStore(Tags)

  console.log('what is', store.selected)

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
          <MenuItems />
        </VerticalColumn>

        <VerticalColumn>
          <Text>Create</Text>
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
            onChange={(e) => store.updateDraft({ type: e.target.value as any })}
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
        </VerticalColumn>
      </HStack>
    </VStack>
  )
})

const TagList = memo(
  graphql(({ type, row }: { type: TagType; row: number }) => {
    const store = useRecoilStore(Tags)
    const parentType: TagType =
      type === 'continent'
        ? 'continent'
        : type === 'country'
        ? 'continent'
        : 'country'

    console.log('selected', parentType, store.selections[parentType])

    const results = query.tag({
      where: {
        type: { _eq: type },
        ...(store.selections[parentType] && {
          parent: { name: { _eq: store.selections[parentType] } },
        }),
      },
      limit: 100,
    })

    return (
      <VStack flex={1} maxHeight="100%">
        <HStack borderBottomColor="#ddd" borderBottomWidth={1}>
          <Text>{type}</Text>
          <Spacer flex={1} />
          <SmallButton
            onPress={() => {
              // upsert({
              //   type,
              //   name: `⭐️ new ${Math.random()}`,
              //   icon: '',
              //   parentId:
              //     parentType === 'country'
              //       ? selectedCountryId
              //       : parentType == 'continent'
              //       ? selectedContinentId
              //       : '',
              // })
            }}
          >
            Add New
          </SmallButton>
        </HStack>
        <ScrollView>
          {results.map((tag, index) => {
            return (
              <ListItem
                key={`${tag.id}${tag.updated_at}`}
                row={row}
                col={index}
                tag={tag}
                isActive={
                  store.selected[0] == row && store.selected[1] == index
                }
              />
            )
          })}
        </ScrollView>
      </VStack>
    )
  })
)

const ListItem = memo(
  ({
    row,
    col,
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

    if (hidden) {
      return null
    }

    return (
      <HStack
        height={32}
        onPress={() => {
          if (Date.now() - lastTap.current < 250) {
            if (editable) {
              setIsEditing(true)
            }
          } else {
            lastTap.current = Date.now()
            store.setSelected([row, col])
          }
        }}
        padding={6}
        {...(isActive && {
          backgroundColor: '#eee',
        })}
      >
        <HStack flex={1}>
          {isEditing && (
            <TextInput
              style={styles.textInput}
              defaultValue={text as any}
              onBlur={(e) => {
                setIsEditing(false)
                const [icon, ...nameParts] = e.target['value'].split(' ')
                const name = nameParts.join(' ')
                const next: TagRecord = {
                  ...tag,
                  icon,
                  name,
                }
                console.log('next is', next)
                upsert(next)
              }}
            />
          )}
          {!isEditing && <Text fontSize={16}>{text}</Text>}

          <div style={{ flex: 1 }} />

          {deletable && (
            <VStack
              onPress={(e) => {
                e.stopPropagation()
                setHidden(true)
                // client.mutate({
                //   variables: {
                //     id: tag.id,
                //   },
                //   mutation: TAXONOMY_DELETE,
                // })
              }}
            >
              <Text>✅</Text>
              {/* <CheckMark name="md-checkmark-circle" /> */}
            </VStack>
          )}
        </HStack>
      </HStack>
    )
  }
)

const MenuItems = memo(
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
