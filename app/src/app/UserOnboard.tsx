import { graphql, uploadFile, useRefetch } from '@dish/graph'
import React, { useEffect, useRef } from 'react'
import { HStack, Input, Paragraph, Spacer, Text, TextArea, Toast, VStack } from 'snackui'

import { isWeb } from '../constants/constants'
import { queryUser } from '../queries/queryUser'
import { characters } from './home/user/characters'
import { UserAvatar } from './home/user/UserAvatar'
import { useStateSynced } from './hooks/useStateSynced'
import { useUserStore } from './userStore'
import { LogoColor } from './views/Logo'
import { SmallButton } from './views/SmallButton'

const useImageUploader = () => {}

export const UserOnboard = graphql(
  ({ hideLogo, onFinish }: { hideLogo?: boolean; onFinish?: Function }) => {
    const refetch = useRefetch()
    const userStore = useUserStore()
    const imageFormRef = useRef(null)
    const formState = useRef({
      name: userStore.user?.name ?? '',
      about: userStore.user?.about ?? '',
      location: userStore.user?.location ?? '',
    })
    const userCharIndex = userStore.user?.charIndex ?? 0
    console.log('userStore.user?.charIndex ?? 0', userStore.user?.charIndex ?? 0)
    const [charIndex, setCharIndex] = useStateSynced(userCharIndex)
    const username = userStore.user?.username ?? ''
    const user = queryUser(username)
    const inputAvatar = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const avatar = inputAvatar.current
      const form = imageFormRef.current
      if (!avatar || !form) return

      const handleUpload = async (e) => {
        const formData = new FormData(form!)
        try {
          Toast.show('Uploading...')
          const avatar = await uploadFile('avatar', formData)
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
    }, [imageFormRef.current, inputAvatar.current])

    return (
      <>
        <VStack
          spacing
          alignItems="center"
          justifyContent="center"
          paddingBottom={60}
          paddingHorizontal={20}
        >
          {!hideLogo && (
            <VStack marginTop={20} spacing alignItems="center">
              <LogoColor scale={2} />

              <Paragraph zIndex={10} color="#fff">
                Welcome to the beta! Lets get you onboarded.
              </Paragraph>

              {divider}
            </VStack>
          )}

          <Spacer />

          <HStack position="relative" alignItems="center" justifyContent="center">
            <UserAvatar avatar={user.avatar ?? ''} charIndex={charIndex} />
            <Spacer />
            {isWeb && (
              <form
                id="userform"
                ref={imageFormRef}
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
          </HStack>

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

          <HStack alignItems="center" justifyContent="center" flexWrap="wrap">
            {characters.map((icon, i) => {
              return (
                <HStack
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
                </HStack>
              )
            })}
          </HStack>

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
        </VStack>
      </>
    )
  }
)

const divider = (
  <VStack
    marginVertical={8}
    width="80%"
    minHeight={1}
    backgroundColor="#fff"
    alignSelf="center"
    opacity={0.1}
  />
)
