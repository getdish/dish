import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useQueryLoud } from '../../helpers/useQueryLoud'

const didJustFill = {
  login: false,
  password: false,
}

export function useFormAction<Values extends { [key: string]: any }>({
  name,
  initialValues,
  submit,
}: {
  name: string
  initialValues: Values
  submit: (n: Values) => Promise<any>
}) {
  const { handleSubmit, errors, control, watch } = useForm()
  const data = useRef(initialValues)
  const [send, setSend] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // will send ultimate form query
  const response = useQueryLoud([name, send], () => submit(data.current), {
    enabled: !!send,
    suspense: false,
    retry: false,
  })

  const onSubmit = handleSubmit(() => {
    console.log('submitting', data.current)
    setIsSubmitting(true)
    setSend(Math.random())
  })

  useEffect(() => {
    data.current = initialValues
  }, [JSON.stringify(initialValues)])

  useEffect(() => {
    if (response.isError || response.data?.error) {
      setIsSubmitting(false)
    }
  }, [response.data, response.isError])

  let prev = ''
  const onChange = (key: keyof Values) => (val: string) => {
    // @ts-expect-error
    data.current[key] = val
    didJustFill[key as string] = val.length > prev.length + 3
    prev = val
    if (didJustFill.login && didJustFill.password) {
      onSubmit()
    }
  }

  let errorMessage = ''

  if (response.isSuccess) {
    console.log('🤠 NICE JOB', send, name, data, response)
  } else {
    if (response.isError) {
      console.log('err response', response)
      errorMessage = `${response.error || ''}`
    }
  }

  return {
    errors,
    errorMessage,
    isSubmitting,
    control,
    response,
    isSuccess: response.isSuccess && response.data && !response.data.error,
    onChange,
    onSubmit,
    watch,
  }
}
