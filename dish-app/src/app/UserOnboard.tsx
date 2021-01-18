import { Auth, graphql } from '@dish/graph'
import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'react-native'
import {
  HStack,
  Input,
  Paragraph,
  Spacer,
  Text,
  TextArea,
  Toast,
  VStack,
} from 'snackui'

import dishNeon from '../assets/dish-neon.jpg'
import { characters } from './home/user/characters'
import { UserAvatar } from './home/user/UserAvatar'
import { useUserQuery } from './home/user/useUserQuery'
import { useUserStore } from './userStore'
import { SmallButton } from './views/SmallButton'

export const UserOnboard = graphql(
  ({ hideLogo, onFinish }: { hideLogo?: boolean; onFinish?: Function }) => {
    const userStore = useUserStore()
    const imageFormRef = useRef(null)
    const formState = useRef({
      about: '',
      location: '',
    })
    const [charIndex, setCharIndex] = useState(0)
    const username = userStore.user?.username ?? ''
    const user = useUserQuery(username)
    const inputAvatar = useRef(null)

    useEffect(() => {
      const handleUpload = async () => {
        const form = imageFormRef.current!
        const formData = new FormData(form)
        try {
          const avatar = await Auth.uploadAvatar(formData)
          console.log('avatar', avatar)
          if (avatar) {
            user.avatar = avatar
            Toast.show('Saved image!')
          } else {
            Toast.error('Error saving  image!')
          }
        } catch (err) {
          Toast.show('Error saving image')
        }
      }

      // fixes safari not working with onChange={}
      const avatar = inputAvatar.current
      if (avatar) {
        avatar.addEventListener('change', handleUpload)
        return () => {
          avatar.removeEventListener('change', handleUpload)
        }
      }
    }, [])

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
            <VStack spacing alignItems="center">
              <Image
                source={{ uri: dishNeon }}
                style={{
                  marginTop: -20,
                  marginBottom: -20,
                  width: 261,
                  height: 161,
                }}
              />

              <Paragraph zIndex={10} color="#fff">
                Welcome to the beta! Lets get you onboarded.
              </Paragraph>

              {divider}
            </VStack>
          )}

          <HStack alignItems="center" justifyContent="center">
            <UserAvatar avatar={user.avatar ?? ''} charIndex={charIndex} />
            <form
              id="userform"
              ref={imageFormRef}
              style={{
                maxWidth: 100,
              }}
            >
              <input type="hidden" name="username" value={username} />
              <label htmlFor="file">Upload a file</label>
              <input
                ref={inputAvatar}
                type="file"
                name="avatar"
                style={{
                  fontSize: 18,
                  padding: 10,
                }}
              />
            </form>
          </HStack>

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
                    console.log('setting', i)
                    setCharIndex(i) // TODO can remove if gqless works
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
            onChangeText={(text) => {
              formState.current.about = text
            }}
          />
          <Input
            color="#fff"
            placeholder="Location..."
            fontSize={16}
            width="100%"
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
              await userStore.edit({
                username,
                charIndex,
                about: formState.current.about,
                location: formState.current.location,
              })
              onFinish?.()
            }}
          >
            Done!
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
