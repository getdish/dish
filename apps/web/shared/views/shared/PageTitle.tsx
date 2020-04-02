import { isWorker } from '../../constants'

export const PageTitle = (props: { children: any }) => {
  if (isWorker) {
    return null
  }
  const { Helmet } = require('react-helmet')
  return (
    <Helmet>
      <title>{props.children}</title>
    </Helmet>
  )
}
