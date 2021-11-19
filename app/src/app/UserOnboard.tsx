import { graphql, useRefetch } from '@dish/graph'
import { Input, Paragraph, Spacer, Text, TextArea, Toast, XStack, YStack } from '@dish/ui'
import React, { useEffect, useRef } from 'react'

import { isWeb } from '../constants/constants'
import { queryUser } from '../queries/queryUser'
import { characters } from './home/user/characters'
import { UserAvatar } from './home/user/UserAvatar'
import { useStateSynced } from './hooks/useStateSynced'
import { useImageUploadForm } from './useImageUploadForm'
import { useUserStore } from './userStore'
import { LogoColor } from './views/Logo'
import { SmallButton } from './views/SmallButton'

export const UserOnboard = graphql(
  ({ hideLogo, onFinish }: { hideLogo?: boolean; onFinish?: Function }) => {
    const refetch = useRefetch()
    const userStore = useUserStore()
    const uploadForm = useImageUploadForm('avatar')
    const formState = useRef({
      name: userStore.user?.name ?? '',
      about: userStore.user?.about ?? '',
      location: userStore.user?.location ?? '',
    })
    const userCharIndex = userStore.user?.charIndex ?? 0
    const [charIndex, setCharIndex] = useStateSynced(userCharIndex)
    const username = userStore.user?.username ?? ''
    const user = queryUser(username)
    const inputAvatar = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const avatar = inputAvatar.current
      if (!avatar) return

      const handleUpload = async (e) => {
        try {
          const avatar = await uploadForm.upload()
          if (avatar) {
            userStore.refresh()
            refetch()
            Toast.success('Saved image!')
          } else {
            Toast.error('Error saving  image!')
          }
        } catch (err) {
          console.error('error', err.message, err.stack)
          Toast.show(`Error saving image: ${err.message.slice(0, 100)}...`)
        }
      }

      // fixes safari not working with onChange={}
      avatar.addEventListener('change', handleUpload)
      return () => {
        avatar.removeEventListener('change', handleUpload)
      }
    }, [inputAvatar.current])

    return (
      <>
        <YStack
          spacing
          alignItems="center"
          justifyContent="center"
          paddingBottom={60}
          paddingHorizontal={20}
        >
          {!hideLogo && (
            <YStack marginTop={20} spacing alignItems="center">
              <LogoColor scale={2} />

              <Paragraph zIndex={10} color="#fff">
                Welcome to the beta! Lets get you onboarded.
              </Paragraph>

              {divider}
            </YStack>
          )}

          <Spacer />

          <XStack position="relative" alignItems="center" justifyContent="center">
            <UserAvatar avatar={user.avatar ?? ''} charIndex={charIndex} />
            <Spacer />
            {isWeb && (
              <form
                id="userform"
                ref={uploadForm.ref}
                style={{
                  maxWidth: 150,
                }}
              >
                <input type="hidden" name="username" value={username} />
                <label htmlFor="input-avatar">
                  <Paragraph ellipse>Upload avatar</Paragraph>
                </label>
                <input
                  ref={inputAvatar}
                  id="input-avatar"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  name="avatar"
                  // this fixes wont open bug for some reason...
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: 18,
                    maxWidth: 120,
                    padding: 10,
                  }}
                />
              </form>
            )}
          </XStack>

          <Spacer />

          <Input
            color="#fff"
            placeholder="Full Name (Optional)..."
            fontSize={16}
            defaultValue={formState.current.name}
            width="100%"
            onChangeText={(text) => {
              formState.current.name = text
            }}
          />

          <Spacer />

          <XStack alignItems="center" justifyContent="center" flexWrap="wrap">
            {characters.map((icon, i) => {
              return (
                <XStack
                  key={i}
                  cursor="pointer"
                  borderRadius={100}
                  padding={10}
                  height={50}
                  width={50}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={i === charIndex ? '#fff' : 'transparent'}
                  hoverStyle={{
                    backgroundColor: i === charIndex ? '#fff' : '#444',
                  }}
                  onPress={() => {
                    setCharIndex(i) // TODO can remove if gqty works
                  }}
                >
                  <Text fontSize={30} lineHeight={25} key={i}>
                    {icon}
                  </Text>
                </XStack>
              )
            })}
          </XStack>

          <Spacer />

          <TextArea
            color="#fff"
            placeholder="Optional description for your profile..."
            fontSize={16}
            width="100%"
            defaultValue={formState.current.about}
            onChangeText={(text) => {
              formState.current.about = text
            }}
          />

          <Input
            color="#fff"
            placeholder="Location..."
            fontSize={16}
            width="100%"
            defaultValue={formState.current.location}
            onChangeText={(text) => {
              formState.current.location = text
            }}
          />

          <Spacer />

          <SmallButton
            // accessibilityComponentType="button"
            accessible
            accessibilityRole="button"
            alignSelf="center"
            onPress={async () => {
              Toast.show('Saving...')
              onFinish?.()
              await userStore.edit({
                ...formState.current,
                username,
                charIndex,
              })
            }}
          >
            Save!
          </SmallButton>
        </YStack>
      </>
    )
  }
)

const divider = (
  <YStack
    marginVertical={8}
    width="80%"
    minHeight={1}
    backgroundColor="#fff"
    alignSelf="center"
    opacity={0.1}
  />
)
