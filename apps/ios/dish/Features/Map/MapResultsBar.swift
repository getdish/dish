import SwiftUI

struct MapResultsBar: View {
  @EnvironmentObject var store: AppStore
  @Environment(\.colorScheme) var colorScheme

  var body: some View {
    VStack {
      Group {
        if Selectors.home.isOnSearchResults(self.store) {
          MapSearchResults()
            .transition(.opacity)
        } else {
          MapExplore()
            .transition(.opacity)
        }
      }
      
      // account for DishLenseBar  - todo make this a variable
      Spacer().frame(height: 130)
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

struct MapExplore: View {
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

struct MapSearchResults: View {
  @EnvironmentObject var store: AppStore
  @State var index = 0
  var dish = features[0]

  var body: some View {
    return DishMapResultItem(
      dish: features[0]
    )
  }
}

fileprivate let total: Int = 10
fileprivate let imageSize: CGFloat = 100

struct DishMapResultItem: View, Equatable {
  static func == (lhs: Self, rhs: Self) -> Bool {
    lhs.dish == rhs.dish
  }
  @Environment(\.colorScheme) var colorScheme
  @EnvironmentObject var screen: ScreenModel
  var dish: DishItem
  
  var body: some View {
    ListItemGallery(
      defaultImagesVisible: 1.5,
      displayContent: .fixed,
      getImage: { (index, size, isActive) in
        DishListItemRestaurantCard(
          dish: self.dish,
          index: index,
          isActive: isActive,
          size: size
        )
    },
      imageSize: imageSize,
      total: total,
      onScrolledToStart: {
        App.store.send(.home(.setFocusedItem(nil)))
    }
    ) {
      HStack(spacing: 12) {
        Text(self.dish.icon)
          .font(.system(size: 32))
        
        Text(self.dish.name)
          .fontWeight(.light)
          .lineLimit(2)
          .font(.system(size: 16))
          .shadow(color: Color.black.opacity(0.1), radius: 0, x: 0, y: 1)
      }
      .padding(.horizontal, 18)
      .padding(.vertical, 5)
      .background(Color(.systemBackground).opacity(0.73))
      .invertColorScheme()
      .cornerRadius(25)
    }
    .offset(y: -20)
  }
}
