import SwiftUI

struct DishDishPage: View {
  var body: some View {
    VStack(spacing: 0) {
      Spacer().frame(height: 30)
      ScrollView {
        VStack(spacing: 0) {
          DishRestaurantDishCard()
          DishRestaurantDishCard()
          DishRestaurantDishCard()
          DishRestaurantDishCard()
        }
      }
      .navigationBarTitle(Text("Top Pho in San Francisco"))
    }
  }
}

struct DishRestaurantDishCard: View {
  @State var showGallery: Bool = false
  
  var body: some View {
    ZStack {
      ImageGallery(
        isPresented: self.$showGallery
      )
      
      Pager(
        pageTurnArrows: true,
        pages: [
          UniqueView(
            id: 0,
            content: AnyView(
              FeatureCard(landmark: features.first!)
                .onTapGesture {
                  self.showGallery = true
              }
            )
          ),
          UniqueView(
            id: 1,
            content: AnyView(
              FeatureCard(landmark: features.first!)
                .onTapGesture {
                  self.showGallery = true
              }
            )
          )
        ]
      )
        .frame(height: 275)
    }
  }
}

#if DEBUG
struct DishDishPage_Previews: PreviewProvider {
  static var previews: some View {
    DishDishPage()
  }
}
#endif
