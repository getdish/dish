import SwiftUI

struct HomeDrawerSearchBar: View {
  // this can be expanded to handle types of filters
  enum SearchToTagColor {
    static let dish = Color(red: 0.2, green: 0.4, blue: 0.7, opacity: 0.5)
    static let filter = Color(red: 0.6, green: 0.2, blue: 0.4, opacity: 0.5)
  }
  
  var showInput = true

  @State var searchText = ""
  @State var textField: UITextField? = nil
  @State var isFirstResponder = false
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  @EnvironmentObject var keyboard: Keyboard
  @Environment(\.colorScheme) var colorScheme

  var hasSearch: Bool {
    store.state.home.viewStates.count > 1
  }

  private var homeSearch: Binding<String> {
    store.binding(for: \.home.viewStates.last!.queryString, { .home(.setSearch($0)) })
  }

  private var homeLocation: Binding<String> {
    store.binding(for: \.map.locationLabel, { .map(.setLocationLabel($0)) })
  }

  func focusKeyboard() {
    self.isFirstResponder = false
    async(2) {
      self.isFirstResponder = true
    }
  }

  func onClear() {
    // go back on empty search clear
    self.store.send(.home(.clearSearch))
  }

  func onTapLeadingIcon() {
    if Selectors.home.isOnHome() {
      self.isFirstResponder = true
    } else {
      self.keyboard.hide()
      self.store.send(.home(.pop))
    }
  }

  func onEditingChanged(_ val: Bool) {
    if val {
      App.store.send(.home(.setSearchFocus(.search)))
    } else {
      async {
        if self.store.state.home.searchFocus == .search {
          App.store.send(.home(.setSearchFocus(.off)))
        }
      }
    }
  }

  var body: some View {
    let isOnHome = Selectors.home.isOnHome()
    let searchFocus = self.store.state.home.searchFocus
    let showSearchIcon = isOnHome || searchFocus == .search
    var iconSize: CGFloat = 16
    let icon: Image = {
      if Selectors.home.lastState().isLoading {
        return Image(systemName: "slowmo")
      }
      if showSearchIcon {
        return Image(systemName: "magnifyingglass")
      } else if searchFocus == .location {
        return Image(systemName: "map")
      } else {
//        iconSize = 16
        return Image(systemName: "magnifyingglass") // chevron.left
      }
    }()

    let isOnSearch = Selectors.home.isOnSearchResults(self.store)
    return HStack(spacing: 0) {
        SearchInput(
          placeholder: "", //"\(lense.name) in \(store.state.map.locationLabel)...",
          inputBackgroundColor: Color.clear,
          borderColor: Color.clear,  //Color.init(white: 0.5, opacity: 0.1),
          scale: 1.2,
          sizeRadius: 1.2,
          icon: icon,
          iconSize: iconSize,
          showCancelInside: true,
          onTapLeadingIcon: self.onTapLeadingIcon,
          onEditingChanged: self.onEditingChanged,
          onClear: self.onClear,
          isFirstResponder: isFirstResponder,
          searchText: self.homeSearch,
          showInput: showInput
        )
        
        DishButton(action: {
          App.store.send(.home(.toggleShowFilters))
        }) {
          Image(systemName: "line.horizontal.3.decrease.circle")
            .resizable()
            .scaledToFit()
            .frame(width: 23, height: 23)
            .padding(10)
            .opacity(0.35)
        }

        if self.store.state.home.searchFocus == .off {
          Group {
            Spacer().frame(width: 6)
            Button(action: {
              App.store.send(.setView(.camera))
            }) {
              VStack {
                Image(systemName: "camera.fill")
                  .resizable()
                  .scaledToFit()
                  .frame(width: isOnSearch ? 16 : 22, height: isOnSearch ? 16 : 22)
                  .padding(isOnSearch ? 12 : 14)
                  .borderRounded(radius: 100, width: 1, color: Color(white: 0.5, opacity: 0.2))
                  .foregroundColor(self.colorScheme == .light ? .black : .white)
              }
            }
          }
        }
      }
      .padding(10)
    .background(self.colorScheme == .light
      ? Color(white: 0.95, opacity: 0.9)
        //
      : Color(white: 0, opacity: 0.00001)
    )
      .cornerRadius(App.searchBarHeight / 3)
  }
}

struct IndentedStyle: ButtonStyle {
  @Environment(\.colorScheme) var colorScheme
  var rgb: [Double]

  var bg: Color {
    self.genColor(rgb, adjust: 0.9)
  }

  var bgDark: Color {
    self.genColor(rgb, adjust: 0.7)
  }

  var darkShadow: Color {
    self.genColor(rgb, adjust: 0.6)
  }

  var lightShadow: Color {
    self.genColor(rgb, adjust: 1.2)
  }

  func genColor(_ rgb: [Double], adjust: Double) -> Color {
    let diff = adjust > 1 ? adjust - 1 : 1 - adjust
    let x = (adjust + diff) - diff * (self.colorScheme == .light ? 0.4 : 1)
    return Color(red: rgb[0] * x, green: rgb[1] * x, blue: rgb[2] * x)
  }

  func makeBody(configuration: Self.Configuration) -> some View {
    let isPressed = configuration.isPressed
    //        let x = Color(.systemGroupedBackground)
    let background: Color = isPressed ? self.bg : self.bgDark

    return configuration.label
      .foregroundColor(
        self.colorScheme == .light
          ? Color(white: 0.38)
          : Color(red: rgb[0] * 1.2, green: rgb[1] * 1.2, blue: rgb[2] * 1.2)
      )
      .padding(14)
      .background(
        LinearGradient(
          gradient: .init(
            colors: isPressed
              ? [background, background]
              : [lightShadow, background]
          ),
          startPoint: .topLeading,
          endPoint: .bottomTrailing
        )
      )
      .cornerRadius(100)
      .shadow(color: isPressed ? lightShadow : darkShadow, radius: 6, x: 6, y: 6)
      .shadow(color: isPressed ? darkShadow : lightShadow, radius: 6, x: -6, y: -6)
      .animation(.spring(response: 0.3))
  }
}

#if DEBUG
  struct HomeDrawerSearchBar_Previews: PreviewProvider {
    static var previews: some View {
      HomeDrawerSearchBar()
        .embedInAppEnvironment()
    }
  }
#endif
