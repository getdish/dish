import SwiftUI

struct HomeViewState {
    var scrollY: CGFloat = 0
    var searchY: CGFloat = 0
    var dragY: CGFloat = 0
    var isSnappedToBottom: Bool {
        searchY + dragY > 100
    }
    var y: CGFloat {
        if isSnappedToBottom {
            return Screen.height - 100
        } else {
            return searchY + dragY
        }
    }
    
    func finishDrag() -> HomeViewState {
        var next = self
        next.searchY = next.dragY + next.searchY
        next.dragY = 0
        return next
    }
}

struct HomeMainView: View {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.geometry) var appGeometry
    
    @State var state = HomeViewState()
    
    var body: some View {
        // pushed map below the border radius of the bottomdrawer
        let appHeight = appGeometry?.size.height ?? 100
        let dishMapHeight = appHeight - Constants.homeInitialDrawerHeight + state.y

        return GeometryReader { geometry in
            ZStack {
                Color.black.frame(maxWidth: .infinity, maxHeight: .infinity)
                
                VStack {
                    ZStack {
                        MapView(
                            width: geometry.size.width,
                            height: Screen.height,
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
                    Spacer().frame(height: dishMapHeight)
                    ScrollView {
                        VStack(spacing: 0) {
                            GeometryReader { gg -> HomeCards in
//                                self.scrollY = min(100, gg.frame(in: .global).minY - dishMapHeight)
                                return HomeCards(
                                    isHorizontal: self.state.isSnappedToBottom
                                )
                            }
                            .frame(height: Screen.height - dishMapHeight)
                        }
                    }
                    .offset(y: self.state.isSnappedToBottom ? -160 : 0)
                    // i want an alpha fade-out effect
                    .mask(
                        LinearGradient(gradient: Gradient(colors: [.white, .black]), startPoint: .top, endPoint: .bottom)
                    )
                }
                
                VStack {
                    SearchBar()
                        .simultaneousGesture(
                            DragGesture()
                                .onChanged { value in
                                    var next = self.state
                                    print("\(value.location.y) \(value.translation.height)")
                                    next.dragY = value.location.y
                                    self.state = next
                            }
                            .onEnded { value in
                                self.state = self.state.finishDrag()
                            }
                    )
                    Spacer()
                }
                    .padding(.horizontal, 10)
                    .offset(y: dishMapHeight - 23)
                
//                DishGalleryView()
            }
            .clipped()
            .shadow(color: Color.black.opacity(0.25), radius: 20, x: 0, y: 0)
        }
    }
}

struct HomeCards: View {
    var isHorizontal: Bool
    
    @ViewBuilder
    var content: some View {
        if isHorizontal {
            return HomeCardsRow()
        } else {
            return HomeCardsGrid()
        }
    }
    
    var body: some View {
        VStack {
            HomeCardsGrid()
        }
        .frame(minWidth: Screen.width, maxHeight: .infinity)
    }
}

struct HomeCardsGrid: View {
    let items = features.chunked(into: 2)

    var body: some View {
        VStack {
            Spacer().frame(height: 60)
            VStack(spacing: 10) {
                ForEach(0 ..< self.items.count) { index in
                    HStack(spacing: 10) {
                        ForEach(self.items[index]) { item in
                            DishBrowseCard(landmark: item)
                            //                                .frame(
                            //                                    //                                            width: (Screen.width - 10 * 4) / 2,
                            //                                    height: 235
                            //                            )
                        }
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}

struct HomeCardsRow: View {
    var body: some View {
        ScrollView {
            HStack {
                ForEach(features) { item in
                    DishBrowseCard(landmark: item)
                }
            }
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


