import SwiftUI

struct HomeSearchResults: View {
    var state: HomeState
    var height: CGFloat = 320
    let items = features
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(self.items) { item in
                    DishBrowseCard(landmark: item)
                        .frame(height: self.height)
                }
            }
            .padding(.horizontal, 20)
        }
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
