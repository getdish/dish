import SwiftUI
import MapKit
import Combine

struct DishMapView: View {
    @State var mapView: MKMapView? = nil
    
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var keyboard: Keyboard
    @State var mapZoom = 10.0
    
    var appWidth: CGFloat { appGeometry?.size.width ?? App.screen.width }
    var appHeight: CGFloat { appGeometry?.size.height ?? App.screen.height }
    
    @State var padding: UIEdgeInsets = .init(top: 100, left: 0, bottom: 100, right: 0)

    var height: CGFloat = 100
    var animate: Bool = false

    var markers: [MapMarker] {
        let results = Selectors.home.lastState().searchResults.results
        return results.map { result in
            MapMarker(
                title: result.name,
                coordinate: result.coordinate
            )
        }
    }
    
    func start() {
    }
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            Group {
                RunOnce(name: "start map") {
                    self.start()
                }
            }
            
            VStack {
                ZStack(alignment: .topLeading) {
                    AppleMapView(
                        currentLocation: store.state.map.moveToLocation,
                        markers: self.markers,
                        mapZoom: self.$mapZoom,
                        onChangeLocation: { location in
                            print("changing location")
                            App.store.send(.map(.setLocation(location)))
                        },
                        // TODO this is tracking the *user* geolocation not the map location
                        // we should probably have both tracking and running things
                        onChangeLocationName: { placemark in
                            if let cityName = placemark.locality {
                                self.store.send(.map(.setLocationLabel(cityName)))
                            }
                        },
                        showsUserLocation: true
                    )
                        .frame(height: App.screen.height * 1.6)
                    
                    // prevent touch on left/right sides for dragging between cards
                    HStack {
                        Color.black.opacity(0.00001).frame(width: 24)
                        Color.clear
                        Color.black.opacity(0.00001).frame(width: 24)
                    }
                    
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

#if DEBUG
struct DishMapView_Previews: PreviewProvider {
    static var previews: some View {
        DishMapView()
            .embedInAppEnvironment()
    }
}
#endif
