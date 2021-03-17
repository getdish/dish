import { Button, Input, Message, Space, Stack } from '@o/ui'
import jsonp from 'jsonp'
import React from 'react'

export class Join extends React.Component<any> {
  state = {
    error: null,
    success: null,
    submitting: false,
  }
  form = React.createRef<HTMLFormElement>()
  email = React.createRef<HTMLInputElement>()
  clearState() {
    this.setState({ error: null, success: null, submitting: false })
  }
  submit = async e => {
    console.log('got submit')
    e.preventDefault()
    this.clearState()
    this.setState({ submitting: true })
    try {
      const finish = state => {
        this.clearState()
        this.setState(state)
      }
      console.log('this.form', this.form)
      const form = this.form.current
      const query = {
        id: '015e5a3442',
        EMAIL: this.email.current.value,
        b_019909d3efb283014d35674e5_015e5a3442: '',
      }
      let url = form.getAttribute('action').replace('/post', '/post-json')
      url = `${url}&${queryString(query)}`
      jsonp(url, { param: 'c' }, (error, data) => {
        if (error) {
          return finish({ error })
        }
        if (data && data.result === 'error') {
          return finish({ error: data.msg })
        }
        return finish({ success: data.msg })
      })
    } catch (err) {
      console.log('errrr', err)
      this.clearState()
      this.setState({ error: err.message })
    }
  }
  render() {
    const { success, error, submitting } = this.state
    const { header, inputProps, ...props } = this.props
    const message = success || error || ''
    return (
      <>
        <form
          action="https://tryorbit.us18.list-manage.com/subscribe/post?u=019909d3efb283014d35674e5"
          method="post"
          id="mc-embedded-subscribe-form-1"
          name="mc-embedded-subscribe-form"
          target="_blank"
          ref={this.form}
          onSubmit={this.submit}
        >
          <Stack {...props}>
            {header}

            <Stack direction="horizontal" group>
              <Input
                type="email"
                nodeRef={this.email}
                name="EMAIL"
                id="mce-EMAIL"
                placeholder="Email address..."
                flex={1}
                size={2}
                sizeRadius={5}
                sizePadding={1.5}
                defaultValue=""
                {...inputProps}
              />
              <Button
                size={2}
                sizeRadius={5}
                sizeFont={0.8}
                sizePadding={2}
                type="submit"
                disabled={submitting}
                opacity={submitting ? 0.5 : 1}
                pointerEvents={submitting ? 'none' : 'auto'}
                cursor="pointer"
                maxWidth={300}
                alignSelf="center"
                glint={false}
              >
                Early access
              </Button>
            </Stack>
          </Stack>
        </form>
        {!!message && (
          <Stack maxWidth={500} margin={[0, 'auto']}>
            <Space size="lg" />
            <Message
              coat={success ? 'success' : error ? 'error' : undefined}
              dangerouslySetInnerHTML={{
                __html: message,
              }}
            />
          </Stack>
        )}
      </>
    )
  }
}

const queryString = query => {
  const esc = encodeURIComponent
  return Object.keys(query)
    .map(k => `${esc(k)}=${k === 'c' ? query[k] : esc(query[k])}`)
    .join('&')
}
