import SwiftUI

struct HomeMainView: View {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    let items = features.chunked(into: 2)
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let appHeight = appGeometry?.size.height ?? 100
        let dishMapHeight = appHeight - Constants.homeInitialDrawerHeight

        return GeometryReader { geometry in
            ZStack {
                Color.black.frame(maxWidth: .infinity, maxHeight: .infinity)
                
                VStack {
                    ZStack {
                        MapView(
                            width: geometry.size.width,
                            height: dishMapHeight,
                            darkMode: self.colorScheme == .dark
                        )
                        HomeMapControls()
                    }
                    .frame(height: dishMapHeight)
                    .cornerRadius(20)
                    .clipped()
                    Spacer()
                }
                
                VStack {
                    Spacer().frame(height: dishMapHeight - 30)
                    ScrollView {
                        Spacer().frame(height: 60)
                        VStack(spacing: 10) {
                            ForEach(0 ..< self.items.count) { index in
                                HStack(spacing: 10) {
                                    ForEach(self.items[index]) { item in
                                        DishBrowseCard(landmark: item)
                                            .frame(
                                                //                                            width: (Screen.width - 10 * 4) / 2,
                                                height: 235
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
                
                VStack {
                    SearchBar()
                    Spacer()
                }
                    .padding(.horizontal, 8)
                    .offset(y: dishMapHeight - 23)
                
                DishGalleryView()
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
        }
    }
}

#if DEBUG
struct HomeMainView_Previews: PreviewProvider {
    static var previews: some View {
        HomeMainView()
            .embedInAppEnvironment()
    }
}
#endif


