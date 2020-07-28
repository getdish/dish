import { fullyIdle, series } from '@dish/async'
import { HStack, Text, VStack } from '@dish/ui'
import { memo, useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import { TextInput } from 'react-native'

import { styles } from './styles'

export const AdminListItem = memo(
  ({
    text,
    isFormerlyActive,
    isActive,
    editable = true,
    deletable = false,
    onSelect,
    onDelete,
    onEdit,
  }: {
    editable?: boolean
    deletable?: boolean
    isActive: boolean
    text: string
    isFormerlyActive?: boolean
    onDelete?: () => void
    onSelect?: () => void
    onEdit?: (name: string) => void
  }) => {
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
