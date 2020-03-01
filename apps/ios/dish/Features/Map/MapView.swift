import Combine
import MapKit
import SwiftUI

struct MapViewContainer: View {
  @EnvironmentObject var store: AppStore
  @EnvironmentObject var keyboard: Keyboard

  var markers: [MapMarker] {
    let results = Selectors.home.latestResultsItems()
    return results.map { result in
      MapMarker(
        title: result.name,
        coordinate: result.coordinate
      )
    }
  }

  var body: some View {
    ZStack(alignment: .topLeading) {
      VStack {
        ZStack(alignment: .topLeading) {
          MapView(
            animated: store.state.appLoaded,
            currentLocation: store.state.map.moveToLocation,
            markers: markers
          )

//          // prevent touch on left/right sides for dragging between cards
//          HStack {
//            Color.black.opacity(0.00001).frame(width: 24)
//            Color.clear
//            Color.black.opacity(0.00001).frame(width: 24)
//          }

          // keyboard dismiss (above map, below content)
          if self.keyboard.state.height > 0 {
            Color.black.opacity(0.2)
              .transition(.opacity)
              .onTapGesture {
                self.keyboard.hide()
              }
          }
        }

        Spacer()
      }
    }
  }
}

struct MapView: View {
  @State var mapZoom = 10.0
  @State var cancellables: Set<AnyCancellable> = []

  var animated: Bool
  var currentLocation: MapViewLocation?
  var markers: [MapMarker]

  func start() {
    var last: BottomDrawerPosition? = nil
    App.store.$state
      .map { $0.home.drawerPosition }
      .removeDuplicates()
      .sink { cur in
        if last == cur { return }
        if cur == .top || cur == .middle && last == .bottom { self.mapZoom -= 0.5 }
        if cur == .bottom || cur == .middle && last == .top { self.mapZoom += 0.5 }
        last = cur
      }
      .store(in: &self.cancellables)
  }

  var body: some View {
    ZStack {
      Color.clear.onAppear {
        self.start()
      }

      AppleMapView(
        animated: self.animated,
        currentLocation: currentLocation,
        markers: self.markers,
        mapZoom: self.$mapZoom,
        onChangeLocation: { location in
          App.store.send(.map(.setLocation(location)))
        },
        // TODO this is tracking the *user* geolocation not the map location
        // we should probably have both tracking and running things
        onChangeLocationName: { placemark in
          if let cityName = placemark.locality {
            App.store.send(.map(.setLocationLabel(cityName)))
          }
        },
        onSelectMarkers: { markers in
          App.store.send(.home(.setSelectedMarkers(markers)))
        },
        showsUserLocation: true
      )
    }
  }
}

#if DEBUG
  struct MapView_Previews: PreviewProvider {
    static var previews: some View {
      MapViewContainer()
        .embedInAppEnvironment()
    }
  }
#endif
