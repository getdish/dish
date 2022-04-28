import { Route, RouteSwitch } from '../Route'
import { Link } from '../views/Link'
import { LinkButton } from '../views/LinkButton'
import { LinkButtonProps } from '../views/LinkProps'
import { SmallTitle } from '../views/SmallTitle'
import { GRAPH_DOMAIN } from '@dish/graph'
import { Heading, Spacer, Text, XStack, YStack } from '@dish/ui'
import loadable from '@loadable/component'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

export default memo(function AdminPage() {
  return (
    <YStack pointerEvents="auto" flex={1} alignItems="center" backgroundColor="#fff">
      <XStack backgroundColor="#eee" width="100%" space={20} padding={5}>
        <Link name="admin">
          <Text fontWeight="700">Admin</Text>
        </Link>

        <Link name="adminTags">Tags</Link>
        <Link name="adminPlaces">Places</Link>
        <Link name="adminReviews">Reviews</Link>
        <Link name="adminUsers">Users</Link>

        <Spacer flex={1} />

        <Link name="home">Dish ⤴️</Link>
      </XStack>
      <RouteSwitch>
        <Route name="adminTags">{() => <AdminTagsPage />}</Route>
        <Route name="adminReviews">{() => <AdminReviewsPage />}</Route>
        <Route name="adminUsers">{() => <AdminUsersPage />}</Route>
        <Route name="adminPlaces">{() => <AdminPlacesPage />}</Route>
        <Route name="admin">
          <ScrollView style={{ width: '100%', height: '100%' }}>
            <YStack alignItems="center" paddingVertical={20} space="$8">
              <Heading>Welcome to dish</Heading>

              <SmallTitle>Manage</SmallTitle>
              <XStack justifyContent="center" flexWrap="wrap" space="$6">
                <AdminLinkButton icon="🏷" name="adminTags">
                  Tags
                </AdminLinkButton>
                <AdminLinkButton icon="🗣" name="adminReviews">
                  Reviews
                </AdminLinkButton>
                <AdminLinkButton icon="👥" name="adminUsers">
                  Users
                </AdminLinkButton>
              </XStack>

              <SmallTitle>Services</SmallTitle>
              <XStack justifyContent="center" flexWrap="wrap" space="$6">
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
              </XStack>

              <SmallTitle>Intranet</SmallTitle>
              <XStack justifyContent="center" flexWrap="wrap" space="$6">
                <AdminLinkButton icon="💬" href="http://dish-headquarters.slack.com/">
                  Slack
                </AdminLinkButton>
                <AdminLinkButton icon="👨‍💻" href="https://github.com/getdish/dish">
                  Github
                </AdminLinkButton>
              </XStack>
            </YStack>
          </ScrollView>
        </Route>
      </RouteSwitch>
    </YStack>
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
      <YStack space alignItems="center">
        <Text height={80 + 20} fontSize={80}>
          {icon}
        </Text>
        <Text color="rgba(0,0,0,0.4)">{children}</Text>
      </YStack>
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

const AdminPlacesPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./AdminPlacesPage').default
    : loadable(() => import('./AdminPlacesPage'))
