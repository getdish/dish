import SwiftUI

struct HomeDrawerContent: View {
    @State var searchText = ""
    @State var scrollAtTop = true
    let items = features.chunked(into: 2)
    
    init() {
        UINavigationBar.appearance().backgroundColor = .clear
    }
    
    var body: some View {
        print("render drawer")
        return VStack(spacing: 3) {
            VStack(spacing: 3) {
                SearchInput(
                    placeholder: "Pho, Burger, Salad...",
                    inputBackgroundColor: Color(.secondarySystemGroupedBackground),
                    scale: self.scrollAtTop ? 1.25 : 1.0,
                    sizeRadius: 2.0,
                    searchText: self.$searchText
                )
                    .padding(.horizontal)
                
                TagsBar()
            }
            
            ScrollView {
                VStack(spacing: 6) {
                    ForEach(0 ..< self.items.count) { index in
                        HStack(spacing: 6) {
                            ForEach(self.items[index]) { item in
                                DishCard(landmark: item)
                            }
                        }
                    }
                    
                    // bottom padding
                    Spacer().frame(height: 40)
                }
            }
            .padding(.horizontal, 6)
        }
    }
}

struct DishCard: View {
    var landmark: Landmark
    
    var body: some View {
        FeatureCard(landmark: landmark, at: .start)
            .cornerRadius(14)
            .onTapGesture {
                //                Store.home.dish = self.landmark
        }
    }
}

#if DEBUG
struct HomeDrawerContent_Previews: PreviewProvider {
    static var previews: some View {
        HomeDrawer()
    }
}
#endif
