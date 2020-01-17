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
            Run {
                if self.homeState.isSnappedToBottom && self.animatePosition == .start {
                    self.animatePosition = .end
                }
                if !self.homeState.isSnappedToBottom && self.animatePosition == .end {
                    self.animatePosition = .start
                }
            }
            
            MagicMove(self.animatePosition) {
                ZStack(alignment: .topLeading) {
                    HomeMainContentExplore()
                        .offset(y: self.homeState.mapHeight)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 18) {
                            ForEach(0 ..< features.count) { index in
                                DishCardView(
                                    dish: features[index],
                                    at: .end,
                                    display: .card
                                )
                                    .frame(width: 160, height: 100)
                            }
                        }
                        .padding(20)
                    }
                    .offset(y: self.homeState.snappedToBottomMapHeight - 160)
                    
                    VStack {
                        Button(action: {
                            self.animatePosition = self.animatePosition == .start ? .end : .start
                        }) {
                            Text("Go")
                        }
                    }.padding(50)
                }
                
            }
            .frame(height: self.appGeometry?.size.height ?? Screen.fullHeight)
            
            Spacer()
        }
        .edgesIgnoringSafeArea(.all)
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

struct DishRowCard: View {
    var dish: DishItem
    var body: some View {
        FeatureCard(dish: dish, aspectRatio: 1.8)
            .cornerRadius(14)
    }
}
