import SwiftUI

struct RestaurantView: View {
  @EnvironmentObject var store: AppStore

  var isRestaurantOpen: Binding<Bool> {
    Binding<Bool>(
      get: { Selectors.home.isOnRestaurant(self.store) },
      set: { next in
        if next == false {
          self.store.send(.home(.popRestaurant))
        }
      }
    )
  }

  var body: some View {
    Color.clear
      .sheet(
        isPresented: self.isRestaurantOpen,
        onDismiss: {
          self.store.send(.home(.popRestaurant))
        }
      ) {
        ScrollView(.vertical) {
          HStack {
            Spacer()
            
            Button(action: {
              self.store.send(.home(.popRestaurant))
            }) {
              Image(systemName: "xmark.circle.fill")
                .resizable()
                .scaledToFit()
                .foregroundColor(Color.black.opacity(0.3))
                .frame(width: 20, height: 20)
                .padding(5)
            }
            .padding(.trailing, 3)
          }
          .frame(height: 40)
            
          RestaurantViewContent()
        }
      }
  }
}

struct RestaurantViewContent: View {
  @EnvironmentObject var screen: ScreenModel
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
          .padding(.bottom, 12)

        HStack {
          DividerView()
          HStack(spacing: 0) {
            Text("#1 in")
              .font(.system(size: 16))
              .fontWeight(.bold)
              .lineLimit(1)
              .fixedSize()
              .foregroundColor(.black)
              .padding(.vertical, 6)
              .padding(.horizontal, 6)
              .background(Color.white)
            
            Text("🇨🇳 Chinese")
              .font(.system(size: 16))
              .fontWeight(.semibold)
              .lineLimit(1)
              .fixedSize()
              .frame(width: 96)
              .foregroundColor(.white)
              .padding(.vertical, 6)
              .padding(.horizontal, 6)
              .background(Color.black)
          }
          .cornerRadius(8)
          .shadow(color: Color.black.opacity(0.3), radius: 5, y: 1)
          DividerView()
        }
        
        Spacer().frame(height: 10)
        
        HStack(spacing: 0) {
          Group {
            Button(action: {}) {
              HStack(spacing: 6) {
                Image(systemName: "phone.fill")
                  .resizable()
                  .scaledToFit()
                  .opacity(0.5)
                  .frame(width: 28, height: 28)
                  .padding()
                
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
            .foregroundColor(
              self.colorScheme == .light ? .black : .white
            )
            
            Color.clear
              .frame(width: 66, height: 66)
          }
          .overlay(
            HStack {
             Spacer()
              AppleMapView(
                markers: [],
                mapZoom: self.$mapZoom
              )
                .frame(width: 100, height: 100)
                .offset(y: -20)
                .cornerRadius(100)
            }
          )
        }
        .padding(.horizontal, 10)
        
        DividerView()
        
        self.spacer
        
        RestaurantTagsRow(
          restaurant: self.restaurant
        )

        Group {
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
        }
        
        ScrollView(.horizontal) {
          HStack {
            Group {
              self.restaurant.image.resizable().scaledToFill()
              self.restaurant.image.resizable().scaledToFill()
              self.restaurant.image.resizable().scaledToFill()
            }
            .frame(maxWidth: 400, maxHeight: 390)
              .cornerRadiusSquircle(32)
              .shadow(radius: 10)
              .overlay(
                VStack {
                  Text("Pho")
                    .foregroundColor(.black)
                    .controlButtonStyle()
                  Spacer()
                }
                .offset(y: -20)
            )
          }
          .padding()
        }
        
        Group {
          self.spacer
          VStack {
            HStack {
              DividerView()
              Text("Review".uppercased())
                .tracking(3)
                .fontWeight(.light)
                .font(.system(size: 14))
                .opacity(0.45)
              DividerView()
            }
          }
          
          self.spacer
        }

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
              .shadow(radius: 5)
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
  var hideRank: Bool = false
  
  var ranking: Int {
    hideRank ? 0 : self.lense.rgb[0] > 0.5 ? 3 : 0
  }
  
  var body: some View {
    HStack(spacing: 0) {
      if ranking > 0 {
        Text("#1")
          .font(.system(size: 14))
          .fontWeight(.bold)
          .fixedSize()
          .foregroundColor(.black)
          .padding(.vertical, 5)
          .padding(.horizontal, 7)
          .background(Color.white)
      }
      
      Text("\(self.lense.icon == "" ? "" : "\(self.lense.icon) ")\(self.lense.name)")
        .font(.system(size: 14))
        .fontWeight(.semibold)
        .fixedSize()
        .lineLimit(1)
        .foregroundColor(.white)
        .padding(.vertical, 5)
        .padding(.horizontal, 7)
        .background(self.lense.color)
    }
    .cornerRadius(8)
    .modifier(TextShadowStyle())
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
