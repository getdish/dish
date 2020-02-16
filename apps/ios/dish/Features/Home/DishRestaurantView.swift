import SwiftUI

struct DishRestaurantView: View {
    @EnvironmentObject var store: AppStore

    var isRestaurantOpen: Binding<Bool> {
        Binding<Bool>(
            get: { Selectors.home.isOnRestaurant() },
            set: { next in
                if next == false {
                    self.store.send(.home(.pop))
                }
        }
        )
    }
    
    var body: some View {
        BottomSheetView(
            isOpen: self.isRestaurantOpen, maxHeight: App.screen.height * 0.9
        ) {
            DishRestaurantViewContent()
        }
    }
}

struct DishRestaurantViewContent: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var colorScheme
    
    var restaurant: RestaurantItem {
        Selectors.home.lastState().restaurant ?? restaurants[0]
    }
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 0) {
                Text("\(self.restaurant.name)")
                    .modifier(TextTitleStyle())
                    .padding(.horizontal, 10)
                    .padding(.bottom, 10)
                
                VStack {
                    self.restaurant.image
                        .resizable()
                        .scaledToFill()
                }
                .frame(maxWidth: .infinity, maxHeight: 250)
                .clipped()
                
                AppleMapView(
                    markers: []
                )
                    .frame(height: 150)
                
                Divider()
                
                HStack(spacing: 0) {
                    Group {
                        Button(action: {}) {
                            HStack {
                                Image(systemName: "map")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 20, height: 20)
                                
                                VStack(alignment: .leading) {
                                    Text("\(self.restaurant.address)")
                                    Text("San Francisco, CA, 94131")
                                        .font(.caption)
                                        .opacity(0.5)
                                }
                                Spacer()
                            }
                            .padding(4)
                        }
                        Button(action: {}) {
                            Image(systemName: "phone")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 26, height: 26)
                                .padding(4)
                        }
                    }
                    .foregroundColor(self.colorScheme == .light ? .black : .white)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                
                Divider()
                
                
//                List {
//
//                    Text("\(self.restaurant.imageName)")
//                    Text("\(self.restaurant.phone)")
//                    Text("\(self.restaurant.stars)")
//                }
                
                Spacer()
            }
            Spacer()
        }
    }
}

struct Divider: View {
    enum DividerDirection {
        case horizontal, vertical
    }
    
    @Environment(\.colorScheme) var colorScheme
    
    var direction: DividerDirection
    var opacity: Double
        
    init(_ direction: DividerDirection = .horizontal, opacity: Double = 0.1) {
        self.direction = direction
        self.opacity = opacity
    }
    
    var body: some View {
        let color = Color(self.colorScheme == .dark ? .white : .black)
            .opacity(self.opacity)
        return Group {
            if self.direction == .horizontal {
                color.frame(height: 1).padding(.horizontal)
            } else {
                color.frame(width: 1).padding(.vertical)
            }
        }
    }
}

struct TextTitleStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.largeTitle)
    }
}

#if DEBUG
struct DishRestaurantViewContent_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            DishRestaurantViewContent()
                .embedInAppEnvironment(Mocks.homeSearchedPhoSelectedRestaurant)
        }
        .padding(.top, 20)
    }
}
#endif
