import Apollo
import SwiftUI

//import Hasura

// For more information check "How To Control The World" - Stephen Celis
// https://vimeo.com/291588126

class AppModel {
  var storeVal: AppStore? = nil
  // to easily test entire app in a certain state, replace this line with a commented out line below
  var store: AppStore {
    self.storeVal ?? AppStore(initialState: AppState(), reducer: appReducer)
  }

  func start(_ initialState: AppStore) {
    self.storeVal = store
    mapSideEffects.start(self.store)
    homeSideEffects.start(self.store)
  }

  // side effects
  let mapSideEffects = MapSideEffects()
  let homeSideEffects = HomeSideEffects()

  var apollo: ApolloClient {
    return ApolloNetwork.shared.apollo
  }

  // models
  let screen = ScreenModel()

  // dynamic
  var enterRepl = false

  // flags
  let enableMap = true

  let enableMapAutoZoom = false
  let enableMapFlags = true
  let enableContent = true
  let enableCamera = true

  // constants
  let animationSpeed: Double = 1

  let keyboard = Keyboard()
  let queueMain = DispatchQueue.main
  let queueMainInteractive = DispatchQueue(label: "", qos: .userInteractive, attributes: .concurrent, target: .main)
  let magicItems = magicItemsStore
  let searchBarHeight: CGFloat = 70
  let filterBarHeight: CGFloat = 46
  let mapBarHeight: CGFloat = 80

  var drawerSnapPoints: [CGFloat] {
    [
      App.screen.edgeInsets.top + 50,
      App.screen.edgeInsets.top + 275,
      App.screen.height - 110 - App.screen.edgeInsets.bottom,
    ]
  }
}
