import SwiftUI
import Combine

fileprivate let filterBarHeight: CGFloat = 55
let bottomNavHeight: CGFloat = 115

import SwiftUI

struct HomeMainContent: View {
    var total = features.count - 4
    
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var homeView: HomeViewState
    
    @ObservedObject var service = HomeMainContentService()
    
    class HomeMainContentService: ObservableObject {
        @Published var animatePosition: MagicItemPosition = .start
        var cancels: Set<AnyCancellable> = []

        init() {
            homeViewState.$y
                .map { _ in
                    homeViewState.isSnappedToBottom
                }
                .removeDuplicates()
                .map { isSnappedToBottom in
                    async {
                        if isSnappedToBottom {
                            self.animatePosition = .end
                        } else {
                            self.animatePosition = .start
                        }
                    }
                }
                .sink {}
                .store(in: &cancels)
        }
    }
    
    var body: some View {
        VStack {
            //            Run {
            //                if homeViewState.isSnappedToBottom && self.dir == .vertical {
            //                    self.dir = .horizontal
            //                }
            //                if !homeViewState.isSnappedToBottom && self.dir == .horizontal {
            //                    self.dir = .vertical
            //                }
            //            }
            
            MagicMove(self.service.animatePosition) {
                ZStack(alignment: .topLeading) {
                    HomeMainContentExplore()
                    
                    ScrollView(.horizontal) {
                        HStack {
                            ForEach(0 ..< self.total) { index in
                                DishCardView(
                                    dish: features[index],
                                    at: .end,
                                    display: .card
                                )
                                    .frame(width: 160, height: 120)
                                    .shadow(color: Color.black.opacity(0.5), radius: 8, x: 0, y: 3)
                            }
                        }
                    }
                }
                
                //                ScrollView(finalDir, showsIndicators: false) {
                //                    VStack {
                //                        VStack {
                //                            HStack {
                //                                ZStack {
                //                                    ForEach(0 ..< total) { index in
                //                                        DishCardView(
                //                                            dish: features[index],
                //                                            display: self.dir == .vertical ? .full : .card
                //                                        )
                //                                            .frame(width: self.cardWidth, height: self.cardHeight)
                //                                            .shadow(color: Color.black.opacity(0.5), radius: 8, x: 0, y: 3)
                //                                            .offset(x: self.cardX(index), y: self.cardY(index))
                //                                    }
                //                                }
                //                                .frame(
                //                                    width: cardWidth,
                //                                    height: cardHeight
                //                                )
                //                                Spacer()
                //                            }
                //                            Spacer()
                ////                            Spacer().frame(height: bottomNavHeight)
                ////                            Spacer().frame(height: homeViewState.mapHeight - homeViewState.scrollRevealY)
                //                        }
                //                    }
                //                    .background(Color.yellow)
                //                    .frame(
                //                        width: innerWidth,
                //                        height: innerHeight
                //                    )
                //                    .introspectScrollView { scrollView in
                //                        let x: UIScrollView = scrollView
                //                        x.isDirectionalLockEnabled = true
                //                        self.scrollView = scrollView
                //                    }
                //                }
                //                .frame(
                //                    width: appGeometry?.size.width,
                //                    height: height
                //                )
                //                    .animation(.spring())
                
                Button(action: {
                    self.service.animatePosition = self.service.animatePosition == .start ? .end : .start
                }) {
                    Text("Go")
                }
            }
            .frame(height: self.appGeometry?.size.height ?? Screen.fullHeight)
            .clipped()
            
            Spacer()
        }
        .offset(y: homeView.mapHeight)
    }
}

struct DishCardView: View, Identifiable {
    enum DisplayCard {
        case card, full, fullscreen
    }
    var id: Int { dish.id }
    var dish: DishItem
    var at: MagicItemPosition = .start
    var display: DisplayCard = .full
    var body: some View {
        let display = self.display
        let dish = self.dish
        
        return MagicItem("\(id)", at: at) {
            GeometryReader { geometry in
                dish.image
                    .resizable()
                    .aspectRatio(geometry.size.width / geometry.size.height, contentMode: .fit)
                    .overlay(self.overlay)
                    .cornerRadius(display == .card ? 14 : 20)
                    .onTapGesture {
                        App.store.send(
                            .home(.push(HomeStateItem(filters: [SearchFilter(name: dish.name)])))
                        )
                }
            }
        }
    }
    
    var overlay: some View {
        ZStack(alignment: .bottomLeading) {
            Rectangle().fill(
                LinearGradient(
                    gradient: Gradient(colors: [Color.black.opacity(0.6), Color.black.opacity(0)]),
                    startPoint: .bottom,
                    endPoint: .center
                )
            )
            VStack(alignment: .leading) {
                Text(self.dish.name)
                    .font(.system(size: 20))
                    .bold()
                //        Text(dish.park)
            }
            .padding()
        }
        .foregroundColor(.white)
    }
}


//struct HomeMainContent: View {
//    let isHorizontal: Bool
//    @EnvironmentObject var store: AppStore
//
//    var body: some View {
//        let isOnSearchResults = Selectors.home.isOnSearchResults()
//
//        return ZStack {
//            HomeMainContentExplore(isHorizontal: self.isHorizontal)
//
//            // pages as you drill in below home
//            if isOnSearchResults {
//                HomeMainContentSearchPage()
//            }
//        }
//    }
//}

struct HomeMainContentExplore: View {
    @Environment(\.geometry) var appGeometry
    
    var body: some View {
        ZStack {
            HomeScrollableContent {
                HomeExploreDishes()
            }
            .frame(width: appGeometry?.size.width, height: appGeometry?.size.height)
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
        return VStack(spacing: self.spacing) {
            ForEach(0 ..< self.items.count) { index in
                HStack(spacing: self.spacing) {
                    ForEach(self.items[index]) { item in
                        DishCardView(
                            dish: item,
                            at: .start,
                            display: .full
                        )
                            // without height set it will change size during animation
                            .frame(width: width, height: height)
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
            .offset(y: -self.homeState.scrollRevealY)
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

struct DishRowCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.8)
            .cornerRadius(14)
    }
}
