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
        Color.clear
            .sheet(isPresented: self.isRestaurantOpen, onDismiss: {
//                
            }) {
                ScrollView(.vertical) {
                    Spacer().frame(height: 40)
                    DishRestaurantViewContent()
                }
        }
    }
}

struct DishRestaurantViewContent: View {
    @Environment(\.colorScheme) var colorScheme
    @State var mapZoom = 1.0
    
     let dishes = features.chunked(into: 2)
    
    var restaurant: RestaurantItem {
        Selectors.home.lastState().restaurant ?? restaurants[0]
    }
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 0) {
                Text("\(self.restaurant.name)")
                    .style(.h1)
                    .padding(.horizontal, 10)
                    .padding(.bottom, 10)
                
                HStack {
                    DividerView()
                    DishRatingView(
                        isMini: false,
                        restaurant: self.restaurant
                    )
                        .frame(width: 80, height: 32)
                    DividerView()
                }
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        Spacer()
                        HStack(spacing: 20) {
                            ForEach(0 ..< self.restaurant.tags.count) { index in
                                // self.restaurant.tags[index]
                                return Text("\(App.store.state.home.lenses[index].name)")
                            }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 12)
                        Spacer()
                    }
                }
                
                VStack {
                    self.restaurant.image
                        .resizable()
                        .scaledToFill()
                }
                .frame(maxWidth: .infinity, maxHeight: 390)
                .clipped()
                
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
                
                DividerView()

                HStack {
                    AppleMapView(
                        markers: [],
                        mapZoom: self.$mapZoom
                    )
                    Color.gray
                }
                    .frame(height: 120)
                
                DividerView()
                
                VStack {
                    Text("Top Dishes")
                        .font(.headline)
                        .padding(.bottom)
                    
                    ForEach(0 ..< dishes.count) { index in
                        HStack {
                            ForEach(self.dishes[index], id: \.id) { dish in
                                DishCardView(
                                    at: .end,
                                    dish: dish,
                                    display: .small,
                                    height: 120
                                )
                                    .equatable()
                            }
                        }
                    }
                }
                .padding()
                
                Spacer()
            }
            Spacer()
        }
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
