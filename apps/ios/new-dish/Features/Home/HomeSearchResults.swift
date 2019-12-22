import SwiftUI

struct HomeSearchResults: View {
    var state: HomeState
    var height: CGFloat = 320
    
    var body: some View {
        VStack {
            Text("")
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack {
                    ForEach(0 ..< 5) { item in
                        DishRestaurantCard()
                            .frame(height: self.height)
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }
}

struct DishRestaurantCard: View {
    var body: some View {
        Image("hiddenlake.jpg")
            .resizable()
            .aspectRatio(2 / 2.25, contentMode: .fit)
            .overlay(TextOverlay(name: "Miss Siagon"))
            .cornerRadius(14)
    }
}


#if DEBUG
struct HomeSearchResults_Previews: PreviewProvider {
    static var previews: some View {
        HomeSearchResults(state: HomeState(search: "Pho"))
            .embedInAppEnvironment()
    }
}
#endif
