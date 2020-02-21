import SwiftUI

struct DishCuisineFilterPopup: View {
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    
    @State var active: String = ""
    
    let continentNames = ["African", "Asian", "European", "North American", "South American"]

    let continents: [String: [String]] = [
        "African": ["🇺🇸 American", "🇲🇽 Mexican"],
        "Asian": ["🇺🇸 American", "🇲🇽 Mexican"],
        "European": ["🇺🇸 American", "🇲🇽 Mexican"],
        "North American": ["🇺🇸 American", "🇲🇽 Mexican"],
        "South American": ["🇺🇸 American", "🇲🇽 Mexican"]
    ]
    
    var activeCountries: [String] {
        if let selected = self.continents[active] {
            return selected
        }
        return []
    }
    
    var body: some View {
        let activeCountries = self.activeCountries
        
        return ZStack {
            Color.black.opacity(0.3)
                .onTapGesture {
                    self.store.send(.home(.toggleShowCuisineFilter))
            }
            
            VStack {
                if self.active == "" {
                    VStack {
                        Text("Continent")
                            .style(.h1)
                        
                        GridView(rows: 2, cols: 3) { row, col, index -> AnyView in
                            let name = self.continentNames[index]
                            return AnyView(
                                Button(action: {
                                    self.active = name
                                }) {
                                    IconView(
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
                                    self.active = ""
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
                width: self.screen.width - 20,
                height: self.screen.width - 20
            )
                .background(
                    BlurView(style: .light)
            )
                .cornerRadius(50)
                .clipped()
        }
    }
}
