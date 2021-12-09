import { isWeb } from '../../constants/constants'
import { ContentScrollContext } from '../views/ContentScrollView'
import {
  Button,
  Form,
  Input, // @ts-ignore
  InputProps,
  Paragraph,
  Text,
  XStack,
  YStack,
  useTheme,
} from '@dish/ui'
import { capitalize } from 'lodash'
import React, { Suspense, useContext } from 'react'
import { Controller, FieldError, RegisterOptions } from 'react-hook-form'

export function SubmittableForm({
  onSubmit,
  submitText = 'Go',
  successText = 'Submit',
  isSuccess,
  errorText,
  children,
  isSubmitting,
  after,
}: {
  onSubmit: any
  isSubmitting: boolean
  submitText?: string
  isSuccess?: boolean
  successText?: string
  errorText?: string
  children?: any
  after?: any
}) {
  return (
    <Form
      onSubmit={onSubmit}
      // @ts-ignore
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSubmit()
        }
      }}
    >
      <YStack space="$2" minWidth={260}>
        {!isSuccess && (
          <Suspense fallback={null}>
            <YStack space="$2">{children}</YStack>
          </Suspense>
        )}

        {!isSuccess && (
          <XStack>
            <YStack flex={1} />
            <Button
              accessible
              accessibilityRole="button"
              alignSelf="flex-end"
              marginLeft="auto"
              onPress={onSubmit}
              theme="active"
              borderRadius={100}
              elevation="$1"
              disabled={isSubmitting}
            >
              {submitText}
              {isSubmitting ? '...' : ''}
            </Button>
          </XStack>
        )}

        {isSuccess && (
          <Text fontSize={14} width={300}>
            {successText}
          </Text>
        )}

        {!!errorText && <ErrorParagraph>{errorText}</ErrorParagraph>}

        {after}
      </YStack>
    </Form>
  )
}

export const ValidatedInput = ({
  control,
  name,
  defaultValue,
  rules,
  errors,
  ...rest
}: InputProps & {
  control: any
  rules?: RegisterOptions
  errors?: FieldError | null
}) => {
  const theme = useTheme()
  const scrollId = useContext(ContentScrollContext)
  return (
    <>
      <Controller
        control={control}
        name={name ?? ''}
        defaultValue={defaultValue ?? ''}
        rules={rules}
        render={({ onChange, onBlur, value }) => {
          return (
            <Input
              color={isWeb ? 'var(--color)' : '#777'}
              // onFocus={() => {
              //   // if (drawerStore.snapIndexName !== 'top') {
              //   //   drawerStore.setSnapIndex(0)
              //   // }
              //   // const scrollStore = getStore(ScrollStore, { id: scrollId })
              //   // if (scrollStore) {
              //   //   scrollStore.scrollTo({ y: 10000000 })
              //   // }
              // }}
              {...(!isWeb && {
                placeholderTextColor: theme.color3,
              })}
              {...rest}
              autoCompleteType={name}
              name={name}
              onBlur={onBlur}
              value={value}
              onChangeText={(val) => {
                onChange(val)
                rest?.onChangeText?.(val)
              }}
            />
          )
        }}
      />
      {errors && <FormError error={errors} />}
    </>
  )
}

const FormError = ({ error }: { error: FieldError | null }) => {
  if (!error) {
    return null
  }

  const name = capitalize(error.ref?.name)

  if (error.type === 'required') {
    return <ErrorParagraph>{name} is required.</ErrorParagraph>
  }

  return (
    <Paragraph>
      {name} error: {error.message}
    </Paragraph>
  )
}

export const ErrorParagraph = (props) => (
  <Paragraph color="red" fontWeight="500" marginVertical={10} {...props} />
)
