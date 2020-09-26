import { getGraphEndpointDomain } from '@dish/graph'
import { HStack, SmallTitle, Spacer, Text, VStack } from '@dish/ui'
import loadable from '@loadable/component'
import React, { memo } from 'react'

import { Route, RouteSwitch } from '../../views/router/Route'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'

export default memo(function AdminPage() {
  return (
    <VStack flex={1} alignItems="center" backgroundColor="#fff">
      <HStack backgroundColor="#eee" width="100%" spacing={20} padding={5}>
        <Link name="admin">
          <Text fontWeight="700">Admin</Text>
        </Link>

        <Link name="adminTags">Tags</Link>
        <Link name="adminReviews">Reviews</Link>

        <Spacer flex={1} />

        <Link name="home">Dish ⤴️</Link>
      </HStack>
      <RouteSwitch>
        <Route name="adminTags">{() => <AdminTagsPage />}</Route>
        <Route name="adminReviews">{() => <AdminReviewsPage />}</Route>
        <Route name="admin">
          <VStack paddingVertical={20} spacing="lg">
            <SmallTitle>Welcome to dish</SmallTitle>

            <HStack flexWrap="wrap" spacing="lg">
              <AdminLinkButton icon="🏷" name="adminTags">
                Tags
              </AdminLinkButton>
              <AdminLinkButton icon="🗣" name="adminReviews">
                Reviews
              </AdminLinkButton>
              <AdminLinkButton icon="💽" href={getGraphEndpointDomain()}>
                Hasura
              </AdminLinkButton>
              <AdminLinkButton
                icon="💪"
                href="https://worker-ui.k8s.dishapp.com/ui"
              >
                Workers
              </AdminLinkButton>
              <AdminLinkButton icon="📈" href="https://grafana.k8s.dishapp.com">
                Graphs
              </AdminLinkButton>
            </HStack>
          </VStack>
        </Route>
      </RouteSwitch>
    </VStack>
  )
})

const AdminLinkButton = ({
  icon,
  children,
  ...props
}: LinkButtonProps & { icon: string }) => {
  return (
    <LinkButton
      fontSize={100}
      noText
      borderRadius={10}
      padding={10}
      paddingHorizontal={20}
      hoverStyle={{
        backgroundColor: '#f9f9f9',
      }}
      {...props}
    >
      <VStack spacing alignItems="center">
        <Text height={120} fontSize={100}>
          {icon}
        </Text>
        <Text color="rgba(0,0,0,0.4)">{children}</Text>
      </VStack>
    </LinkButton>
  )
}

const AdminTagsPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./AdminTagsPage').default
    : loadable(() => import('./AdminTagsPage'))

const AdminReviewsPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./AdminReviewsPage').default
    : loadable(() => import('./AdminReviewsPage'))
