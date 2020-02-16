import SwiftUI

struct DishRestaurantView: View {
    @EnvironmentObject var store: AppStore

    var isRestaurantOpen: Binding<Bool> {
        Binding<Bool>(
            get: { Selectors.home.isOnRestaurant() },
            set: { next in
                if next == false {
                    self.store.send(.home(.pop))
                }
        }
        )
    }
    
    var body: some View {
        BottomSheetView(
            isOpen: self.isRestaurantOpen, maxHeight: App.screen.height * 0.9
        ) {
            DishRestaurantViewContent()
        }
    }
}

struct DishRestaurantViewContent: View {
    @EnvironmentObject var store: AppStore
    
    var restaurant: RestaurantItem {
        Selectors.home.lastState().restaurant ?? restaurants[0]
    }
    
    var body: some View {
        VStack {
            Text("\(self.restaurant.name)")
            Text("\(self.restaurant.address)")
            Text("\(self.restaurant.imageName)")
            Text("\(self.restaurant.phone)")
            Text("\(self.restaurant.stars)")
        }
    }
}

#if DEBUG
struct DishRestaurantViewContent_Previews: PreviewProvider {
    static var previews: some View {
        DishRestaurantViewContent()
            .embedInAppEnvironment(Mocks.homeSearchedPhoSelectedRestaurant)
    }
}
#endif
