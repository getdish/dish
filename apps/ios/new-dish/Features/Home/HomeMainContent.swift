import SwiftUI
import Combine

fileprivate let items = features.chunked(into: 2)
fileprivate let filterBarHeight: CGFloat = 55
let bottomNavHeight: CGFloat = 115

import SwiftUI

struct HomeMainContent: View {
    var total = features.count - 4
    
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var homeState: HomeViewState
    
    @State var animatePosition: MagicItemPosition = .start
    
    var body: some View {
        VStack {
//            Run {
//                if self.homeView.isSnappedToBottom && self.animatePosition == .start {
//                    self.animatePosition = .end
//                }
//                if !self.homeView.isSnappedToBottom && self.animatePosition == .end {
//                    self.animatePosition = .start
//                }
//            }
            
            MagicMove(self.animatePosition) {
                ZStack(alignment: .topLeading) {
//                    HomeMainContentExplore()

                    ScrollView(showsIndicators: false) {
                        VStack(spacing: 0) {
                            Spacer().frame(height: filterBarHeight + 22 + self.homeState.scrollRevealY)
                            VStack(spacing: 8) {
                                ForEach(0 ..< items.count) { index in
                                    HStack(spacing: 8) {
                                        ForEach(0 ..< 2) { index2 in
                                            DishCardView(
                                                dish: items[index][index2],
                                                at: .start,
                                                display: .full,
                                                height: 120
                                            )
                                        }
                                    }
                                    .padding(.horizontal)
                                }
                            }
                            Spacer().frame(height: bottomNavHeight)
                            Spacer().frame(height: self.homeState.mapHeight - self.homeState.scrollRevealY)
                        }
                    }
                    
//                    ScrollView(.vertical) {
//                        VStack {
//                            ForEach(0 ..< self.total) { index in
//                                DishCardView(
//                                    dish: features[index],
//                                    at: .start,
//                                    display: .full
//                                )
//                                    .frame(width: 400, height: 400)
//                                    .shadow(color: Color.black.opacity(0.5), radius: 8, x: 0, y: 3)
//                            }
//                        }
//                    }
                    
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
                .offset(y: self.homeState.mapHeight)
                
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
                    self.animatePosition = self.animatePosition == .start ? .end : .start
                }) {
                    Text("Go")
                }
            }
            .frame(height: self.appGeometry?.size.height ?? Screen.fullHeight)
            .clipped()
            
            Spacer()
        }
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
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    let items = features.chunked(into: 2)
    let spacing: CGFloat = 14
    
    var body: some View {
        ZStack {
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
                    VStack(spacing: self.spacing) {
                        ForEach(0 ..< self.items.count) { index in
                            HStack(spacing: self.spacing) {
                                ForEach(self.items[index]) { item in
                                    DishCardView(
                                        dish: item,
                                        at: .start,
                                        display: .full,
                                        height: 120
                                    )
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                    Spacer().frame(height: bottomNavHeight)
                    Spacer().frame(height: homeState.mapHeight - self.homeState.scrollRevealY)
                }
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
            Spacer()
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
