import SwiftUI

fileprivate let filterBarHeight: CGFloat = 55
let bottomNavHeight: CGFloat = 115

import SwiftUI

struct HomeMainContent: View {
    var height: CGFloat
    var total = features.count - 4
    var cardPad: CGFloat = 10.0
    
    @EnvironmentObject var homeView: HomeViewState
    @Environment(\.geometry) var appGeometry
    @State var dir: Axis.Set = .vertical {
        willSet(val) {
            if val == .horizontal {
                self.finalDir = val
            } else {
                async(400) {
                    self.finalDir = val
                }
            }
        }
    }
    @State var finalDir: Axis.Set = .vertical
    
    var cardWidth: CGFloat {
        switch dir {
            case .vertical: return Screen.width - 20
            case .horizontal: return 160.0
            default: return 0
        }
    }
    var cardHeight: CGFloat {
        switch dir {
            case .vertical: return Screen.width - 20
            case .horizontal: return 160.0 * (1/1.8)
            default: return 0
        }
    }
    
    var innerWidth: CGFloat {
        finalDir == .vertical ? appGeometry?.size.width ?? Screen.width : CGFloat(total) * (cardWidth + cardPad)
    }
    
    var innerHeight: CGFloat {
        finalDir == .horizontal ? height : CGFloat(total) * (cardHeight + cardPad)
    }
    
    func cardX(_ x: Int) -> CGFloat {
        dir == .vertical ? cardPad : CGFloat(x) * (cardWidth + cardPad)
    }
    
    func cardY(_ y: Int) -> CGFloat {
        var val: CGFloat = dir == .horizontal ? 0 : CGFloat(y) * (cardHeight + cardPad)
        if homeView.isSnappedToBottom {
            val += homeView.mapHeight - cardHeight - 75
        } else {
            val += homeView.mapHeight + filterBarHeight + homeView.scrollRevealY
        }
        return val
    }
    
    var body: some View {
        VStack {
            Run {
                if homeViewState.isSnappedToBottom && self.dir == .vertical {
                    self.dir = .horizontal
                }
                if !homeViewState.isSnappedToBottom && self.dir == .horizontal {
                    self.dir = .vertical
                }
            }
            
            ZStack {
//                ScrollView(showsIndicators: false) {
//                    VStack(spacing: 0) {
//                        ScrollListener(onScroll: { frame in
//                            if self.homeState.dragState == .idle {
//                                let mapHeight = self.homeState.mapHeight
//                                self.homeState.setScrollY(
//                                    mapHeight - frame.minY - Screen.statusBarHeight - self.homeState.scrollRevealY
//                                )
//                            }
//                        })
//                        Spacer().frame(height: filterBarHeight + 22 + self.homeState.scrollRevealY)
//                        self.content
//                        Spacer().frame(height: bottomNavHeight)
//                        Spacer().frame(height: homeState.mapHeight - self.homeState.scrollRevealY)
//                    }
//                }
//                .offset(y: homeState.mapHeight - self.homeState.scrollRevealY)
                
                ScrollView(finalDir, showsIndicators: false) {
                    ZStack {
                        VStack {
                            HStack {
                                ZStack {
                                    ForEach(0 ..< total) { index in
                                        DishCardView(
                                            dish: features[index],
                                            display: self.dir == .vertical ? .full : .card
                                        )
                                            .frame(width: self.cardWidth, height: self.cardHeight)
                                            .shadow(color: Color.black.opacity(0.5), radius: 8, x: 0, y: 3)
                                            .offset(x: self.cardX(index), y: self.cardY(index))
                                    }
                                }
                                .frame(
                                    width: cardWidth,
                                    height: cardHeight
                                )
                                Spacer()
                            }
                            Spacer()
//                            Spacer().frame(height: bottomNavHeight)
//                            Spacer().frame(height: homeViewState.mapHeight - homeViewState.scrollRevealY)
                        }
                    }
                    .frame(
                        width: innerWidth,
                        height: innerHeight
                    )
                }
                .frame(
                    width: appGeometry?.size.width,
                    height: height
                )
                    .animation(.spring())
            }
            .padding(.top, Screen.statusBarHeight * 2)
            .frame(height: height)
            .clipped()
            
            Spacer()
        }
        //        ContextMenuRootView {
        //            HomeContainerView()
        //        }
    }
}

struct DishCardView: View, Identifiable {
    enum DisplayCard {
        case card, full, fullscreen
    }
    var id: Int { dish.id }
    var dish: DishItem
    var display: DisplayCard = .full
    var body: some View {
        let display = self.display
        let dish = self.dish
        
        return GeometryReader { geometry in
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
                        DishCardView(dish: item)
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

struct DishRowCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.8)
            .cornerRadius(14)
    }
}
