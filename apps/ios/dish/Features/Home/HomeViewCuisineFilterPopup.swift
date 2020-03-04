import SwiftUI

struct HomeViewCuisineFilterPopup: View {
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  
  var active: Bool = false
  @State var activeContinent: String = "All"
  
  let continentNames = ["Africa", "America", "Asia", "Europe"]
  let continentIcons = ["🌍", "🥢", "🇪🇺", "🌎"]
  
  let continents: [String: [String]] = [
    "All": ["🇺🇸 American", "🇲🇽 Mexican", "🇺🇸 American", "🇲🇽 Mexican", "🇺🇸 American", "🇲🇽 Mexican", "🇺🇸 American", "🇲🇽 Mexican", "🇺🇸 American", "🇲🇽 Mexican", "🇺🇸 American", "🇲🇽 Mexican", "🇺🇸 American", "🇲🇽 Mexican", "🇺🇸 American", "🇲🇽 Mexican"],
    "African": ["🇺🇸 American", "🇲🇽 Mexican"],
    "Asian": ["🇺🇸 American", "🇲🇽 Mexican"],
    "European": ["🇺🇸 American", "🇲🇽 Mexican"],
    "American": ["🇺🇸 American", "🇲🇽 Mexican"],
  ]
  
  var activeCountries: [String] {
    if let selected = self.continents[activeContinent] {
      return selected
    }
    return []
  }
  
  var body: some View {
    let activeCountries = self.activeCountries
    let size = self.screen.width - 20
    let rows = activeCountries.count / 3
    
    return ZStack {
      Color.black
        .onTapGesture {
          self.store.send(.home(.toggleShowCuisineFilter))
      }
      .opacity(active ? 0.3 : 0)
      .animation(.spring())
      
      VStack {
        // content container
        VStack {
          //          SwipeDownToDismissView(onClose: {
          //            self.store.send(.home(.toggleShowCuisineFilter))
          //          }) {
          VStack {
            ZStack {
              Text("Cuisine").style(.h1)
              
              HStack {
                Spacer()
                Button(action: {
                  self.activeContinent = "All"
                  self.store.send(.home(.setCuisineFilter("Cuisine")))
                  self.store.send(.home(.toggleShowCuisineFilter))
                }) {
                  Text("Clear")
                }
                .buttonStyle(Color.gray, scale: 0.9)
              }
            }
            .padding(.top)
            
            HStack {
              if self.activeContinent != "All" {
                Button(action: {
                  self.activeContinent = "All"
                }) {
                  Image(systemName: "xmark.circle.fill")
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(Color.black.opacity(0.4))
                    .frame(width: 18, height: 18)
                    .padding(4)
                }
                .transition(.scale)
              }
              
              Picker(selection: self.$activeContinent, label: Text("")) {
                ForEach(0..<4) { index -> AnyView in
                  let name = self.continentNames[index]
                  return AnyView(
                    Text(name).tag(name)
                  )
                }
              }
              .pickerStyle(SegmentedPickerStyle())
              .animation(.spring())
            }
          }
          .padding(.horizontal, 12)
          //          }
          
          ScrollView {
            VStack {
              GridView(rows: rows, cols: 3) { row, col, index -> CountryButton in
                let full = self.activeCountries[index]
                let name = "\(full[2...full.count])"
                let icon = "\(full[0...1])"
                return CountryButton(icon: icon, name: name, onSelect: {
                  self.activeContinent = "All"
                  self.store.send(.home(.setCuisineFilter(icon)))
                  self.store.send(.home(.toggleShowCuisineFilter))
                })
              }
              .frame(height: CGFloat(rows) * 110)
            }
            .padding(.horizontal, 20)
          }
        }
        .frame(
          width: size,
          height: size
        )
          .padding(.vertical, 10)
          .background(
            BlurView(style: .light)
        )
          .cornerRadiusSquircle(25)
          .clipped()
          .shadow(color: Color.black.opacity(0.35), radius: 20, x: 0, y: 10)
          .disabled(!self.active)
          .opacity(self.active ? 1 : 0)
          .scaleEffect(self.active ? 1 : 0.9)
          .animation(.spring())
          .overlay(
            VStack {
              HStack {
                Button(action: {
                  self.store.send(.home(.toggleShowCuisineFilter))
                }) {
                  Image(systemName: "xmark")
                    .resizable()
                    .frame(width: 20, height: 20)
                }
                .frame(width: 44, height: 44)
                .position(x: -44 / 2, y: -44 / 2)
                Spacer()
              }
              Spacer()
            }
        )
      }
    }
  }
}

struct CountryButton: View {
  var icon: String
  var name: String
  var onSelect: () -> Void
  
  var body: some View {
    Button(action: {
      self.onSelect()
    }) {
      IconView(
        background: Color(red: 0.2, green: 0.2, blue: 0.2, opacity: 0.1),
        image: AnyView(Text(icon).font(.system(size: 42))),
        imageSize: 42,
        label: name
      )
        .padding(.vertical, 5)
    }
  }
}

extension View {
  func buttonStyle(_ color: Color = .gray, scale: CGFloat = 1) -> some View {
    self
      .font(.system(size: 16 * scale))
      .padding(.horizontal, 10 * scale)
      .padding(.vertical, 8 * scale)
      .background(color)
      .foregroundColor(.white)
      .cornerRadius(9 * scale)
      .shadow(color: Color.black.opacity(0.25), radius: 3 * scale, y: 1 * scale)
  }
}
