import SwiftUI

struct HomeSearchResults: View {
    var state: HomeState
    let items = restaurants
    
    var body: some View {
        VStack {
            ScrollView(.vertical, showsIndicators: false) {
                VStack {
                    Spacer().frame(height: cardRowHeight)

                    ForEach(items) { item in
                        DishRestaurantCard(restaurant: item)
                    }
                }
                .padding(16)
            }
        }
    }
}

struct DishRestaurantCard: View {
    @ObservedObject var restaurant: RestaurantItem

    var body: some View {
        ZStack {
            restaurant.image
                .resizable()
                .aspectRatio(2 / 2.25, contentMode: .fit)
                .overlay(TextOverlay(name: "Miss Siagon"))
                .cornerRadius(14)
            
            // left right pagination
            
            HStack {
                Color.black.opacity(0.0001)
                    .onTapGesture {
                        print("prev!")
                        self.restaurant.prev()
                    }
                
                Color.clear
                
                Color.black.opacity(0.0001)
                    .onTapGesture {
                        print("next!")
                        self.restaurant.next()
                }
            }
        }
    }
}


#if DEBUG
struct HomeSearchResults_Previews: PreviewProvider {
    static var previews: some View {
        HomeSearchResults(state: HomeState(dish: "Pho"))
            .embedInAppEnvironment()
    }
}
#endif
