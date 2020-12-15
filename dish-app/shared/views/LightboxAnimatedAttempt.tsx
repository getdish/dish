// import { photo, useQuery } from '@dish/graph'
// import { useMemo, useState } from 'react'
// import { Dimensions, Image, StyleSheet } from 'react-native'
// import {
//   ScrollView,
//   TapGestureHandler,
// } from 'react-native-gesture-handler-compiled'
// import Animated, {
//   measure,
//   runOnJS,
//   useAnimatedGestureHandler,
//   useAnimatedRef,
//   useAnimatedStyle,
//   useSharedValue,
// } from 'react-native-reanimated'
// import { HStack, Text } from 'snackui'

// const AnimatedImage = Animated.createAnimatedComponent(Image)

// const dimensions = Dimensions.get('window')

// const HEADER_HEIGHT = 100

// const GUTTER_WIDTH = 3

// const NUMBER_OF_IMAGES = 4
// const IMAGE_SIZE =
//   (dimensions.width - GUTTER_WIDTH * (NUMBER_OF_IMAGES - 1)) / NUMBER_OF_IMAGES

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
// })

// type OnPhotoPress = (
//   ref: ReturnType<typeof useAnimatedRef>,
//   item: photo,
//   opts: {
//     imageOpacity: Animated.SharedValue<number>
//     width: Animated.SharedValue<number>
//     height: Animated.SharedValue<number>
//     x: Animated.SharedValue<number>
//     y: Animated.SharedValue<number>
//   }
// ) => void

// function ListItem({
//   index,
//   onPress,
//   item,
// }: {
//   item: photo
//   onPress: OnPhotoPress
//   index: number
// }) {
//   const ref = useAnimatedRef()
//   const opacity = useSharedValue(1)

//   const containerStyle = {
//     marginRight: (index + 1) % 4 === 0 ? 0 : GUTTER_WIDTH,
//     marginBottom: GUTTER_WIDTH,
//   }

//   const styles = useAnimatedStyle(
//     Object.assign(
//       () => {
//         return {
//           with: IMAGE_SIZE,
//           height: IMAGE_SIZE,
//           opacity: opacity.value,
//         }
//       },
//       {
//         _closure: {},
//       }
//     ),
//     [{}]
//   )

//   const width = useSharedValue(0)
//   const height = useSharedValue(0)
//   const x = useSharedValue(0)
//   const y = useSharedValue(0)

//   function handlePress() {
//     onPress(ref, item, { imageOpacity: opacity, width, height, x, y })
//   }

//   const handler = useAnimatedGestureHandler({
//     onFinish(evt, _ctx, isCanceledOrFailed) {
//       if (isCanceledOrFailed) return

//       const measurements = measure(ref)

//       width.value = measurements.width
//       height.value = measurements.height
//       x.value = measurements.pageX
//       y.value = measurements.pageY - HEADER_HEIGHT

//       //@ts-expect-error
//       runOnJS(handlePress)(evt)
//     },
//   })

//   console.log(106106, styles, AnimatedImage)

//   return (
//     <TapGestureHandler onGestureEvent={handler}>
//       <Animated.View style={containerStyle}>
//         <AnimatedImage ref={ref} source={{ uri: item.url }} style={styles} />
//       </Animated.View>
//     </TapGestureHandler>
//   )
// }

// function ImageList({
//   images,
//   onItemPress,
// }: {
//   images: photo[]
//   onItemPress: OnPhotoPress
// }) {
//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       {images.map((item, i) => {
//         if (!item.url) return null

//         return <ListItem onPress={onItemPress} key={i} index={i} item={item} />
//       })}
//     </ScrollView>
//   )
// }

// export const Lightbox = ({ restaurantSlug }: { restaurantSlug: string }) => {
//   const [activeImage, setActiveImage] = useState<string>(null)
//   const query = useQuery()

//   const restaurant = query.restaurant({
//     where: {
//       slug: {
//         _eq: restaurantSlug,
//       },
//     },
//   })[0]

//   if (!restaurant) return null

//   const photos_xref = restaurant.photo_table({
//     limit: 5,
//   })

//   const photos = useMemo(() => photos_xref.map(({ photo }) => photo), [
//     photos_xref,
//   ])

//   console.log(157, photos)

//   return (
//     <ScrollView style={{ width: '100%', height: '100%' }} horizontal>
//       {activeImage && <Image source={{ uri: activeImage }} />}
//       <HStack>
//         <ImageList
//           images={photos}
//           onItemPress={() => {
//             console.log('PRESS')
//           }}
//         />
//       </HStack>
//     </ScrollView>
//   )
// }
