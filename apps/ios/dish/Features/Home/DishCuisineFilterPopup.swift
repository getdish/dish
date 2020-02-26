import SwiftUI

struct DishCuisineFilterPopup: View {
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    
    var active: Bool = false
    @State var activeContinent: String = ""
    
    let continentNames = ["African", "Asian", "European", "American"]
    let continentIcons = ["🌍", "🥢", "🇪🇺", "🌎"]
    let continents: [String: [String]] = [
        "African": ["🇺🇸 American", "🇲🇽 Mexican"],
        "Asian": ["🇺🇸 American", "🇲🇽 Mexican"],
        "European": ["🇺🇸 American", "🇲🇽 Mexican"],
        "American": ["🇺🇸 American", "🇲🇽 Mexican"]
    ]
    
    var activeCountries: [String] {
        if let selected = self.continents[activeContinent] {
            return selected
        }
        return []
    }
    
    var body: some View {
        let activeCountries = self.activeCountries
        
        return ZStack {
            Color.black
                .onTapGesture {
                    self.store.send(.home(.toggleShowCuisineFilter))
                }
                .opacity(active ? 0.3 : 0)
                .animation(.spring())
            
            VStack {
                if self.activeContinent == "" {
                    VStack {
                        Text("Continent")
                            .style(.h1)
                        
                        GridView(rows: 2, cols: 2) { row, col, index -> AnyView in
                            let name = self.continentNames[index]
                            return AnyView(
                                Button(action: {
                                    self.activeContinent = name
                                }) {
                                    IconView(
                                        background: Color(red: 0.2, green: 0.2, blue: 0.2, opacity: 0.1),
                                        image: AnyView(Text(self.continentIcons[index]).font(.system(size: 42))),
                                        imageSize: 42,
                                        label: name
                                    )
                                        .padding(.vertical, 10)
                                }
                            )
                        }
                    }
                } else {
                    VStack {
                        List {
                            ForEach(0 ..< activeCountries.count) { index in
                                Button(action: {
                                    let cuisineFlag = "\(activeCountries[index].prefix(1))"
                                    self.store.send(.home(.setCuisineFilter(cuisineFlag)))
                                    self.activeContinent = ""
                                    self.store.send(.home(.toggleShowCuisineFilter))
                                }) {
                                    Text("\(activeCountries[index])")
                                }
                            }
                        }
                    }
                }
            }
                .padding(20)
                .frame(
                    width: self.screen.width - 40,
                    height: self.screen.width - 40
                )
                .background(
                    BlurView(style: .light)
                )
                .cornerRadius(50)
                .clipped()
                .disabled(!active)
                .opacity(active ? 1 : 0)
                .scaleEffect(active ? 1 : 0.9)
                .animation(.spring())
        }
    }
}
