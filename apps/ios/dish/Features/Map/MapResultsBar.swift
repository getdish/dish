import SwiftUI

struct MapResultsBar: View {
  @EnvironmentObject var store: AppStore
  @Environment(\.colorScheme) var colorScheme

  var body: some View {
    VStack {
      Group {
        if Selectors.home.isOnSearchResults(self.store) {
          HomeMapSearchResults()
            .transition(.opacity)
        } else {
          HomeMapExplore()
            .transition(.opacity)
        }
      }
      
      // account for DishLenseBar  - todo make this a variable
      Spacer().frame(height: 120)
    }
    .background(
        ZStack {
          self.colorScheme == .dark
            ? LinearGradient(
              gradient: Gradient(colors: [.clear, .black]),
              startPoint: .top,
              endPoint: .center
            )
            : LinearGradient(
              gradient: Gradient(colors: [Color.clear, Color.init(white: 0, opacity: 0.2)]),
              startPoint: .top,
              endPoint: .bottom
            )
        }
          .drawingGroup()
      )
  }
}

struct HomeMapExplore: View {
  @EnvironmentObject var store: AppStore
  @State var index: Int = 0

  var id: String {
    self.store.state.appLoaded ? "0" : "1"
  }

  var items: [DishItem] {
    self.store.state.appLoaded ? features : Array(features[0..<3])
  }

  var body: some View {
    ScrollView(.horizontal, showsIndicators: false) {
      HStack(spacing: 15) {
        ForEach(self.items, id: \.id) { item in
          MapResultDishCard(dish: item)
            .equatable()
        }
          .id(self.id)
      }
        .padding(.vertical, 10)
        .padding(.horizontal, 20)
        .drawingGroup()
    }
      .frame(width: App.screen.width, height: App.mapBarHeight)
  }

  struct MapResultDishCard: View, Identifiable, Equatable {
    var dish: DishItem
    var id: Int { self.dish.id }

    var body: some View {
      DishCardView(
        dish: dish,
        display: .small,
        height: App.mapBarHeight - 15
      )
        .frame(width: 120, height: App.mapBarHeight)
    }
  }

}

struct HomeMapSearchResults: View {
  @EnvironmentObject var store: AppStore
  @State var index = 0

  var body: some View {
//    let width: CGFloat = max(100, (App.screen.width - 40) * 0.4)
//    let results = Selectors.home.latestResultsItems(store)
    return DishListItem(
      dish: features[0],
      number: index + 1
    )
  }
}
