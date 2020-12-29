import { fullyIdle, series } from '@dish/async'
import { X } from '@dish/react-feather'
import React, { memo, useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { HStack, Text, VStack } from 'snackui'

import { useColumnStore, useRowStore } from './SelectionStore'
import { styles } from './styles'

export type AdminListItemProps = {
  id: string
  column: number
  row: number
  editable?: boolean
  deletable?: boolean
  text: string
  onDelete?: () => void
  onSelect?: () => void
  onEdit?: (name: string) => void
}

export const AdminListItem = memo(
  ({
    row,
    column,
    id,
    text,
    editable = true,
    deletable = false,
    onSelect,
    onDelete,
    onEdit,
  }: AdminListItemProps) => {
    const rowStore = useRowStore({ id, column })
    const columnStore = useColumnStore({ id })
    const isRowActive = useRowStore({ id, column }, (s) => s.row === row)
    const isColumnActive = useColumnStore({ id }, (s) => s.column === column)
    const isActive = isRowActive && isColumnActive
    const isFormerlyActive = isRowActive && !isColumnActive
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
      return undefined
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
            console.log('selecting', onSelect)
            lastTap.current = Date.now()
            // @ts-ignore
            columnStore.setColumn(column)
            // @ts-ignore
            rowStore.setRow(row)
            onSelect?.()
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
                  onEdit?.(value)
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
                onDelete?.()
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
