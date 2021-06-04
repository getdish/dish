import { GRAPH_DOMAIN } from '@dish/graph'
import loadable from '@loadable/component'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'
import { HStack, Spacer, Text, Title, VStack } from 'snackui'

import { Route, RouteSwitch } from '../Route'
import { Link } from '../views/Link'
import { LinkButton } from '../views/LinkButton'
import { LinkButtonProps } from '../views/LinkProps'
import { SmallTitle } from '../views/SmallTitle'

export default memo(function AdminPage() {
  return (
    <VStack pointerEvents="auto" flex={1} alignItems="center" backgroundColor="#fff">
      <HStack backgroundColor="#eee" width="100%" spacing={20} padding={5}>
        <Link name="admin">
          <Text fontWeight="700">Admin</Text>
        </Link>

        <Link name="adminTags">Tags</Link>
        <Link name="adminReviews">Reviews</Link>
        <Link name="adminUsers">Users</Link>

        <Spacer flex={1} />

        <Link name="home">Dish ⤴️</Link>
      </HStack>
      <RouteSwitch>
        <Route name="adminTags">{() => <AdminTagsPage />}</Route>
        <Route name="adminReviews">{() => <AdminReviewsPage />}</Route>
        <Route name="adminUsers">{() => <AdminUsersPage />}</Route>
        <Route name="admin">
          <ScrollView style={{ width: '100%', height: '100%' }}>
            <VStack alignItems="center" paddingVertical={20} spacing="xxl">
              <Title>Welcome to dish</Title>

              <SmallTitle>Manage</SmallTitle>
              <HStack justifyContent="center" flexWrap="wrap" spacing="lg">
                <AdminLinkButton icon="🏷" name="adminTags">
                  Tags
                </AdminLinkButton>
                <AdminLinkButton icon="🗣" name="adminReviews">
                  Reviews
                </AdminLinkButton>
                <AdminLinkButton icon="👥" name="adminUsers">
                  Users
                </AdminLinkButton>
              </HStack>

              <SmallTitle>Services</SmallTitle>
              <HStack justifyContent="center" flexWrap="wrap" spacing="lg">
                <AdminLinkButton icon="💽" href={GRAPH_DOMAIN}>
                  Hasura
                </AdminLinkButton>
                <AdminLinkButton icon="💪" href="https://worker.dishapp.com">
                  Workers
                </AdminLinkButton>
                <AdminLinkButton icon="👨‍👩‍👧‍👦" href="https://buildkite.com/dish">
                  CI
                </AdminLinkButton>
                <AdminLinkButton icon="🗳" href="https://registry.dishapp.com">
                  Registry
                </AdminLinkButton>
                {/* <AdminLinkButton icon="📈" href="https://grafana.k8s.dishapp.com">
                  Graphs
                </AdminLinkButton> */}
                <AdminLinkButton
                  icon="📍"
                  href="https://traefik.dishapp.com/dashboard/#/http/routers/dish-registry-https@docker"
                >
                  Router (Traefik)
                </AdminLinkButton>
                <AdminLinkButton icon="🐝" href="http://104.243.45.240:9001">
                  Swarm (Portainer)
                </AdminLinkButton>
              </HStack>

              <SmallTitle>Intranet</SmallTitle>
              <HStack justifyContent="center" flexWrap="wrap" spacing="lg">
                <AdminLinkButton icon="💬" href="http://dish-headquarters.slack.com/">
                  Slack
                </AdminLinkButton>
                <AdminLinkButton icon="👨‍💻" href="https://github.com/getdish/dish">
                  Github
                </AdminLinkButton>
              </HStack>
            </VStack>
          </ScrollView>
        </Route>
      </RouteSwitch>
    </VStack>
  )
})

const AdminLinkButton = ({
  icon,
  children,
  ...props
}: Omit<LinkButtonProps, 'icon'> & { icon: string }) => {
  return (
    <LinkButton
      borderRadius={10}
      padding={10}
      paddingHorizontal={20}
      hoverStyle={{
        backgroundColor: '#f9f9f9',
      }}
      {...props}
    >
      <VStack spacing alignItems="center">
        <Text height={80 + 20} fontSize={80}>
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

const AdminUsersPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./AdminUsersPage').default
    : loadable(() => import('./AdminUsersPage'))
