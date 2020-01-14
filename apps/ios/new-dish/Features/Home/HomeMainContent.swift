import SwiftUI

fileprivate let filterBarHeight: CGFloat = 55
fileprivate let bottomNavHeight: CGFloat = 115

struct HomeMainContent: View {
    let isHorizontal: Bool
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        let isOnSearchResults = Selectors.home.isOnSearchResults()
        
        return ZStack {
            HomeMainContentExplore(isHorizontal: self.isHorizontal)
            
            // pages as you drill in below home
            if isOnSearchResults {
                HomeMainContentSearchPage()
            }
        }
    }
}

struct HomeMainContentExplore: View {
    let isHorizontal: Bool
    @Environment(\.geometry) var appGeometry
    
    var body: some View {
        ZStack {
            HomeScrollableContent {
                HomeExploreDishes()
            }
                .frame(width: appGeometry?.size.width, height: appGeometry?.size.height)
                .opacity(self.isHorizontal ? 0 : 1)
                .disabled(self.isHorizontal)
        }
        .edgesIgnoringSafeArea(.all)
        .clipped()
    }
}

struct HomeMainContentSearchPage: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    @State var dragX: CGFloat = 0
    
    var body: some View {
        let isOnSearchResults = Selectors.home.isOnSearchResults()
        
        return GeometryReader { geometry in
            ZStack {
                ForEach(self.store.state.home.state) { state in
                    VStack {
                        HomeSearchResultsView(
                            state: state
                        )
                            .offset(
                                x: self.dragX,
                                y: isOnSearchResults ? 0 : 100
                        )
                            .opacity(isOnSearchResults ? 1 : 0)
                    }
                    .offset(y: self.homeState.mapHeight)
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
}

struct HomeExploreDishes: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.geometry) var appGeometry
    let items = features.chunked(into: 2)
    let spacing: CGFloat = 14
    
    var body: some View {
        let width = (self.appGeometry?.size.width ?? Screen.width) / 2 - self.spacing * 2
        let height = width * (1/1.4)
        
        print("HomeExploreDishes \(width)")
        return VStack(spacing: self.spacing) {
            ForEach(0 ..< self.items.count) { index in
                HStack(spacing: self.spacing) {
                    ForEach(self.items[index]) { item in
                        DishGridCard(dish: item)
                            // without height set it will change size during animation
                            .frame(width: width, height: height)
                            .onTapGesture {
                                print("tap on item")
                                self.store.send(.home(
                                    .push(HomeStateItem(filters: [SearchFilter(name: item.name)]))
                                ))
                        }
                    }
                }
            }
        }
    }
}

struct HomeScrollableContent<Content>: View where Content: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    @Environment(\.geometry) var appGeometry
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        VStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    ScrollListener(onScroll: { frame in
                        if self.homeState.dragState == .idle {
                            let mapHeight = self.homeState.mapHeight
                            self.homeState.setScrollY(
                                mapHeight - frame.minY - Screen.statusBarHeight - self.homeState.scrollRevealY
                            )
                        }
                    })
                    Spacer().frame(height: filterBarHeight + 22 + self.homeState.scrollRevealY)
                    self.content
                    Spacer().frame(height: bottomNavHeight)
                    Spacer().frame(height: homeState.mapHeight - self.homeState.scrollRevealY)
                }
            }
            .offset(y: homeState.mapHeight - self.homeState.scrollRevealY)
//            .mask(self.mask.offset(y: homeState.mapHeight + filterBarHeight / 4))
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
                Color.black,
                Color.black
            ]),
            startPoint: .top,
            endPoint: .bottom
        )
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
                        .frame(width: 160, height: cardRowHeight)
                        .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 5)
                }
                Spacer().frame(height: bottomNavHeight)
            }
            .padding(.horizontal)
        }
        .frame(width: Screen.width)
    }
}

struct DishRowCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.8)
            .cornerRadius(14)
    }
}
