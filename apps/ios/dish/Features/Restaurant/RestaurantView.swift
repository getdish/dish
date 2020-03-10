import SwiftUI

struct RestaurantView: View {
  @EnvironmentObject var store: AppStore

  var isRestaurantOpen: Binding<Bool> {
    Binding<Bool>(
      get: { Selectors.home.isOnRestaurant(self.store) },
      set: { next in
        if next == false {
          self.store.send(.home(.pop))
        }
      }
    )
  }

  var body: some View {
    Color.clear
      .sheet(
        isPresented: self.isRestaurantOpen,
        onDismiss: {
          self.store.send(.home(.pop))
        }
      ) {
        ScrollView(.vertical) {
          Spacer().frame(height: 40)
          RestaurantViewContent()
        }
      }
  }
}

struct RestaurantViewContent: View {
  @Environment(\.colorScheme) var colorScheme
  @State var mapZoom = 1.0

  let dishes = features

  var restaurant: RestaurantItem {
    return Selectors.home.lastState().restaurant ?? restaurants[0]
  }
  
  var spacer: some View {
    Spacer().frame(height: 16)
  }

  var body: some View {
    HStack {
      VStack(alignment: .leading, spacing: 0) {
        Text("\(self.restaurant.name)")
          .style(.h1)
          .lineLimit(2)
          .padding(.horizontal, 16)
          .padding(.bottom, 6)

        HStack {
          DividerView()
          DishRatingView(
            isMini: false,
            restaurant: self.restaurant
          )
            .frame(width: 80, height: 32)
          DividerView()
        }

        RestaurantTagsRow(
          restaurant: self.restaurant
        )
        
        HStack(spacing: 0) {
          Group {
            Button(action: {}) {
              HStack(spacing: 20) {
                Image(systemName: "map")
                  .resizable()
                  .scaledToFit()
                  .frame(width: 18, height: 18)
                
                VStack(alignment: .leading, spacing: 4) {
                  Text("\(self.restaurant.address)")
                    .font(.system(size: 15))
                  
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
                .frame(width: 24, height: 24)
                .padding(6)
            }
          }
          .foregroundColor(self.colorScheme == .light ? .black : .white)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        
        AppleMapView(
          markers: [],
          mapZoom: self.$mapZoom
        )
        .frame(height: 120)
        
        self.spacer
        
        VStack {
          HStack {
            DividerView()
            Text("Best Dishes".uppercased())
              .tracking(3)
              .fontWeight(.light)
              .font(.system(size: 14))
              .opacity(0.45)
            DividerView()
          }
        }
        
        self.spacer

        self.restaurant.image
          .resizable()
          .scaledToFill()
          .frame(maxWidth: .infinity, maxHeight: 390)
          .cornerRadiusSquircle(32)
          .shadow(radius: 10)
          .padding()
          .overlay(
            VStack {
              Text("Pho")
                .foregroundColor(.black)
                .controlButtonStyle()
              Spacer()
            }
          )

        Spacer()
      }
    }
  }
}

struct RestaurantTagsRow: View {
  var restaurant: RestaurantItem

  var body: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack {
        Spacer()
        HStack(spacing: 14) {
          ForEach(0..<self.restaurant.tags.count) { index in
            // self.restaurant.tags[index]
            return RestaurantLenseView(lense: App.store.state.home.lenses[index])
          }
        }
        .padding(.horizontal)
        .padding(.vertical, 12)
        Spacer()
      }
    }
  }
}

struct RestaurantLenseView: View {
  var lense: LenseItem
  
  var body: some View {
    VStack {
      Text("\(self.lense.icon == "" ? "" : "\(self.lense.icon) ")\(self.lense.name)")
        .font(.system(size: 14))
        .fontWeight(.semibold)
        .lineLimit(1)
        .foregroundColor(.white)
    }
    .padding(.vertical, 6)
    .padding(.horizontal, 7)
    .background(Color.black)
    .cornerRadius(8)
    .shadow(color: Color.black.opacity(0.3), radius: 5, y: 1)
  }
}

#if DEBUG
  struct RestaurantViewContent_Previews: PreviewProvider {
    static var previews: some View {
      VStack {
        RestaurantViewContent()
          .embedInAppEnvironment(Mocks.homeSearchedPhoSelectedRestaurant)
      }
        .padding(.top, 20)
    }
  }
#endif
