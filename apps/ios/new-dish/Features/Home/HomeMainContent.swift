import SwiftUI

fileprivate let filterBarHeight: CGFloat = 55
fileprivate let bottomNavHeight: CGFloat = 115

struct HomeMainContent: View {
    let isHorizontal: Bool
    @EnvironmentObject var store: AppStore
    @State var dragX: CGFloat = 0
    
    var body: some View {
        let isOnSearchResults = Selectors.home.isOnSearchResults()

        return GeometryReader { geometry in
            ZStack {
                Group {
                    if self.isHorizontal {
                        HomeCardsRow()
                    } else {
                        HomeCardsGrid()
                    }
                }
                
                // pages as you drill in below home
                if isOnSearchResults {
                    ZStack {
                        ForEach(self.store.state.home.state) { state in
                            HomeSearchResultsView(
                                state: state
                            )
                                .offset(
                                    x: self.dragX,
                                    y: isOnSearchResults ? 0 : 100
                            )
                                .opacity(isOnSearchResults ? 1 : 0)
                        }
                        .gesture(
                            DragGesture()
                                .onChanged { value in
                                    // right edge
                                    if value.startLocation.x < 10 {
                                        self.dragX = value.translation.width
                                    }
                            }
                            .onEnded { value in
                                let frameWidth = geometry.size.width
                                let offset = value.translation.width / frameWidth
                                let offsetV = value.predictedEndTranslation.width / frameWidth
                                let score = abs(offset * 0.4 + offsetV * 0.6)
                                let shouldChange = score > 0.2
                                withAnimation(.spring()) {
                                    self.dragX = shouldChange ? frameWidth : 0
                                }
                            }
                        )
                    }
                }
            }
            .clipped()
        }
    }
}

struct HomeCardsGrid: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    @Environment(\.geometry) var appGeometry
    
    @State var initY: CGFloat = 0

    let items = features.chunked(into: 2)
    let spacing: CGFloat = 10
    
    var body: some View {
        return VStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    ScrollListener(onScroll: { frame in
                        if self.initY == 0 {
                            DispatchQueue.main.async {
                                self.initY = frame.minY
                            }
                        }
                        if HomeDragLock.state == .idle {
                            let scrollY = frame.minY
                            let y = self.initY - scrollY
                            self.homeState.setScrollY(y)
                        }
                    })
                    Spacer().frame(height: filterBarHeight + 18)
                    self.content
                    Spacer().frame(height: bottomNavHeight)
                    Spacer().frame(height: homeState.mapHeight)
                }
            }
            .offset(y: homeState.mapHeight)
            .animation(.spring())
            .mask(self.mask.offset(y: homeState.mapHeight))
        }
    }
    
    var mask: some View {
        LinearGradient(
            gradient: .init(colors: [
                Color.white.opacity(0),
                Color.white.opacity(0),
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black,
                Color.black
            ]),
            startPoint: .top,
            endPoint: .bottom
        )
    }
    
    var content: some View {
        VStack(spacing: self.spacing) {
            ForEach(0 ..< self.items.count) { index in
                HStack(spacing: self.spacing) {
                    ForEach(self.items[index]) { item in
                        DishGridCard(dish: item)
                            .frame(width: (self.appGeometry?.size.width ?? Screen.width) / 2 - self.spacing * 2)
                            .onTapGesture {
                                print("tap on item")
                                self.store.send(
                                    .home(
                                        .push(HomeStateItem(filters: [SearchFilter(name: item.name)]))
                                    )
                                )
                        }
                    }
                }
            }
        }
    }
    
}

struct DishGridCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.4, at: .start)
            .cornerRadius(14)
    }
}

struct HomeCardsRow: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(features) { item in
                    DishRowCard(dish: item)
                        .frame(width: 160, height: cardRowHeight - 40)
                        .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 5)
                }
                Spacer().frame(height: bottomNavHeight)
            }
            .padding(.horizontal)
        }
    }
}

struct DishRowCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.8, at: .end)
            .cornerRadius(14)
    }
}
