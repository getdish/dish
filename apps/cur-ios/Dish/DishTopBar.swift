import SwiftUI
import CoreLocation

let bottomPad = CGFloat(5)
let topPad = Screen.statusBarHeight
let totalHeight = topPad + bottomPad + 40

struct DishTopBar: View {
  @State var isEditing = false
  
  var body: some View {
    ZStack {
      SearchResults()
      
      VStack {
        VStack {
          HStack(spacing: 12) {
            DishSearchBar(
              isEditing: self.$isEditing
            )
            if !isEditing {
              DishAccountIcon()
            }
          }
          .padding(.horizontal)
        }
        .padding(.top, topPad)
        .padding(.bottom, bottomPad)
        .frame(maxHeight: totalHeight, alignment: Alignment.top)
        
        Spacer()
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: Alignment.top)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: Alignment.topLeading)
  }
}

struct DishSearchBar: View {
  @Binding var isEditing: Bool
  @ObservedObject private var locationStore = Store.location
  @ObservedObject private var searchStore = Store.mapSearch
  @ObservedObject private var homeStore = Store.home
  
  func focus() {
    searchStore.showResults = true
  }
  
  var body: some View {
    VStack {
      if homeStore.showDrawer || homeStore.currentPage == .camera {
        VStack {
          ZStack {
            // camera controls
            HStack {
              Button(action: {
              }) {
                VStack {
                  Text("@ Pancho Villa Taqueria")
                    .fontWeight(.bold)
                }
                .padding(.vertical, 4)
                .padding(.horizontal, 8)
                .background(Color.white.opacity(0.2))
                .cornerRadius(20)
                .onTapGesture {
                  Store.camera.showRestaurantDrawer.toggle()
                }
              }
              .foregroundColor(.white)
              .offset(y: self.homeStore.isOnHomePage ? -80 : 0)
              .animation(
                Animation.spring().delay(!self.homeStore.isOnHomePage ? 0.25 : 0.0)
              )
              
              Spacer()
            }
            
            // home controls
            HStack {
              Button(action: {
              }) {
                VStack {
                  Text("San Francisco")
                    .fontWeight(.bold)
                }
                .padding(.vertical, 4)
                .padding(.horizontal, 8)
                .background(Color.white.opacity(0.2))
                .cornerRadius(20)
              }
              .foregroundColor(.white)
              .offset(y: self.homeStore.isOnHomePage ? 0 : -80)
              .animation(Animation.spring().delay(self.homeStore.isOnHomePage ? 0 : 0.25))
              
              Button(action: {
              }) {
                VStack {
                  Text("within 10 miles")
                    .font(.system(size: 13))
                }
                .padding(.vertical, 4)
                .padding(.horizontal, 8)
                .background(Color.white.opacity(0.2))
                .cornerRadius(20)
              }
              .foregroundColor(.white)
              .offset(y: self.homeStore.isOnHomePage ? 0 : -80)
              .animation(Animation.spring().delay(self.homeStore.isOnHomePage ? 0.2 : 0.4))

              Spacer()
            }
          }
          .frameFlex()
        }
        .frame(maxWidth: .infinity)
        .environment(\.colorScheme, .dark)
      } else {
        SearchInput(
          placeholder: "Current Location",
          inputBackgroundColor: Color(.secondarySystemGroupedBackground).opacity(self.isEditing ? 1.0 : 0.5),
          icon: self.locationStore.lastKnownLocation != nil ? "location.fill" : "location",
          showCancelInside: true,
          onEditingChanged: { isEditing in
            withAnimation(.spring()) {
              self.isEditing = isEditing
            }
        },
          onCancel: {
            Store.mapSearch.showResults = false
        },
          //              after: AnyView(
          //                Button(action: {
          //                  self.locationStore.goToCurrentLocation()
          //                }) {
          //                  Image(systemName: self.locationStore.lastKnownLocation != nil ? "location.fill" : "location")
          //                }
          //              ),
          searchText: $searchStore.search
        )
          .shadow(color: Color.black.opacity(0.25), radius: 5, x: 0, y: 5)
          .onTapGesture {
            self.focus()
        }
      }
    }
  }
}

struct DishAccountIcon: View {
  var body: some View {
    Button(action: {
      Store.home.showMenuDrawer.toggle()
    }) {
      HStack {
        Image(systemName: "person.crop.circle.fill") // ellipsis
          .resizable()
          //          .foregroundColor(Color(.secondarySystemFill))
          .frame(width: 20, height: 20)
          .padding(6)
      }
      .background(Color(.secondarySystemBackground))
      .cornerRadius(40)
      .shadow(color: Color.black.opacity(0.35), radius: 5, x: 0, y: 4)
    }
  }
}

struct SearchResults: View {
  @ObservedObject var mapSearch = Store.mapSearch
  @ObservedObject var searchStore = Store.mapSearch
  
  var body: some View {
    ZStack {
      BlurView(style: .systemThickMaterial)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
      
      VStack {
        Spacer().frame(height: 100)
        
        List {
          ForEach(mapSearch.results) { result in
            Button(action: {
              self.mapSearch.search = "\(result.name)"
              self.mapSearch.showResults = false
            }) {
              HStack {
                VStack {
                  Text("\(result.name)")
                }
              }
            }
            .background(Color("transparent"))
          }
          .listRowBackground(Color("transparent"))
        }
        .background(Color("transparent"))
        .listRowBackground(Color("transparent"))
      }
    }
    .opacity(searchStore.showResults ? 1 : 0)
    .disabled(!searchStore.showResults)
    .animation(.spring())
  }
}

#if DEBUG
struct SearchMap_Previews: PreviewProvider {
  static var previews: some View {
    VStack {
      DishTopBar()
    }
    .background(
      LinearGradient(gradient: Gradient(colors: [.white, .red]), startPoint: .top, endPoint: .bottom)
    )
    //    .edgesIgnoringSafeArea(.all)
  }
}
#endif
