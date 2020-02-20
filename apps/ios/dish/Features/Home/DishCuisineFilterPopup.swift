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
                    List {
                        ForEach(0 ..< continentNames.count) { index in
                            Button(action: {
                                self.active = self.continentNames[index]
                            }) {
                                Text("\(self.continentNames[index])")
                            }
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
                    BlurView(style: .regular)
            )
                .cornerRadius(50)
                .clipped()
        }
    }
}
