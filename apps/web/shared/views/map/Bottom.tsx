import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { StyleSheet, View, Button, Text } from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel'

import { useOvermind } from '../../state/om'
import Restaurant from './Restaurant'
import TopDishes from './TopDishes'
import TopRestaurants from './TopRestaurants'
import UserReviews from './UserReviews'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  close: {
    width: 100,
    alignSelf: 'flex-end',
    margin: 3,
  },
})

export default function Bottom() {
  const [panel, setPanel] = useState<SlidingUpPanel>(null)

  return (
    <View style={styles.container}>
      <SlidingUpPanel
        draggableRange={{ top: 100 + 180 - 64, bottom: 180 }}
        height={500}
        ref={c => setPanel(c)}
        friction={0.12}
      >
        <View style={styles.content}>
          <View style={styles.close}>
            <Button title="Hide" onPress={() => panel.hide()} />
          </View>
          <Switch>
            <Route exact path="/">
              <TopDishes />
            </Route>
            <Route exact path="/account/reviews">
              <UserReviews />
            </Route>
            <Route path="/user/:user">
              <UserReviews />
            </Route>
            <Route path="/e/:slug">
              <Restaurant />
            </Route>
            <Route path="/best/:dish">
              <TopRestaurants />
            </Route>
          </Switch>
        </View>
      </SlidingUpPanel>
    </View>
  )
}
