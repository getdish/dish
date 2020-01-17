import SwiftUI
import Combine

fileprivate let items = features.chunked(into: 2)
fileprivate let filterBarHeight: CGFloat = 55

let bottomNavHeight: CGFloat = 115
// used in search results for now...
let cardRowHeight: CGFloat = 140

import SwiftUI

struct HomeMainContent: View {
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var homeState: HomeViewState
    @EnvironmentObject var store: AppStore
    
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
            
            MagicMove(self.animatePosition, duration: 500 * (1 / ANIMATION_SPEED)) {
                ZStack(alignment: .topLeading) {
                    // results list below map
                    ZStack {
                        if Selectors.home.isOnSearchResults() {
                            HomeSearchResultsView(
                                state: Selectors.home.lastState()
                            )
                        } else {
                            HomeContentExplore()
                        }
                    }
                        .offset(y: self.homeState.mapHeight)
                    
                    // results bar below map
                    ZStack {
                        if Selectors.home.isOnSearchResults() {
                            HomeMapSearchResults()
                        } else {
                            HomeMapExplore()
                        }
                    }
                        .opacity(self.homeState.isSnappedToBottom ? 1 : 0)
                        .offset(y: self.homeState.snappedToBottomMapHeight - cardRowHeight - 20)
                    
                    ZStack(alignment: .center) {
                        Button(action: {
                            self.animatePosition = self.animatePosition == .start ? .end : .start
                        }) {
                            Text("Go").padding(10)
                        }
                    }
                    .frameFlex()
                }
            }
            .frameFlex()
            .clipped()
            
            Spacer()
        }
    }
}

struct HomeMapExplore: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(0 ..< features.count) { index in
                    DishCardView(
                        dish: features[index],
                        at: .end,
                        display: .card
                    )
                        .frame(width: 150, height: cardRowHeight - 40)
                }
            }
            .padding(20)
        }
    }
}

struct HomeMapSearchResults: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(Selectors.home.lastState().searchResults.results) { item in
                    return DishRestaurantCard(
                        restaurant: RestaurantItem(
                            id: item.id,
                            name: item.name,
                            imageName: "turtlerock",
                            address: "",
                            phone: "",
                            tags: [],
                            rating: 8
                        ),
                        aspectRatio: 1.8,
                        isMini: true,
                        at: .end
                    )
                        .frame(width: 140, height: cardRowHeight - 40)
                        .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 5)
                }
            }
            .frame(height: cardRowHeight - 40)
            .padding(20)
        }
        .offset(y: -40)
    }
}

struct HomeContentExplore: View {
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
