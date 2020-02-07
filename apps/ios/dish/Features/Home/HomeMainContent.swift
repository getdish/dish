import SwiftUI
import Combine

fileprivate let items = features.chunked(into: 2)
fileprivate let cardRowHeight: CGFloat = 120

struct HomeMainContentContainer<Content>: View where Content: View {
    @State var animatePosition: MagicItemPosition = .start
    var isSnappedToBottom: Bool = false
    var disableMagicTracking: Bool = false
    var content: Content
    
    init(isSnappedToBottom: Bool, disableMagicTracking: Bool, @ViewBuilder content: @escaping () -> Content) {
        self.isSnappedToBottom = isSnappedToBottom
        self.disableMagicTracking = disableMagicTracking
        self.content = content()
    }
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            SideEffect("HomeMainContent.animateToEnd",
                       condition: { self.isSnappedToBottom && self.animatePosition == .start }) {
                self.animatePosition = .end
            }
            
            SideEffect("HomeMainContent.animateToStart",
                       condition: { !self.isSnappedToBottom && self.animatePosition == .end }) {
                self.animatePosition = .start
            }

            PrintGeometryView("HomeMainContent")
            
            MagicMove(self.animatePosition,
                      duration: 300 * (1 / ANIMATION_SPEED),
                      // TODO we need a separate "disableTracking" in homeStore that is manually set
                      // why? when hitting "map" toggle button when above snapToBottomAt this fails for now
                      disableTracking: disableMagicTracking
            ) {
                self.content
            }
        }
    }
}

// renders on every frame of HomeViewState, so keep it fairly light
struct HomeMainContent: View {
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var homeState: HomeViewState
    @EnvironmentObject var store: AppStore
    
    @State var animatePosition: MagicItemPosition = .start
    @State var shouldUpdateMagicPositions: Bool = true
    
    var body: some View {
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
            .offset(y: self.homeState.mapHeight - self.homeState.searchBarYExtra)
            
            // results bar below map
            ZStack {
                if Selectors.home.isOnSearchResults() {
                    HomeMapSearchResults()
                } else {
                    HomeMapExplore()
                }
            }
            .opacity(self.homeState.isSnappedToBottom ? 1 : 0)
            .offset(y: self.homeState.snappedToBottomMapHeight - cardRowHeight - 16)
        }
        // note! be sure to put any animation on this *inside* magic move
        // or else it messes up the magic move measurement - you can test
        // by turning on MagicMove's fileprivate debug flag to see
        // also: only making it bouncy during drag to avoid more problems
        .animation(.spring(response: 0.38), value: self.homeState.dragState == .idle)
        // .animation(self.homeState.dragState != .idle ? .spring() : .none)
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
                        .equatable()
                        .frame(width: 125, height: cardRowHeight - 40)
                }
            }
            .padding(20)
        }
    }
}

fileprivate let extraHeight: CGFloat = 40

struct HomeMapSearchResults: View {
    @EnvironmentObject var store: AppStore
    @State var index = 0
    
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
                        isMini: true,
                        at: .end
                    )
                        .frame(width: Screen.width - 40, height: cardRowHeight - 40 + extraHeight)
                }
            }
            .frame(height: cardRowHeight - 40 + extraHeight)
            .padding(20)
        }
        .offset(y: -extraHeight)
    }
    
    // almost working
    //        ScrollViewEnhanced(
    //            index: self.$index,
    //            direction: .horizontal,
    //            showsIndicators: false,
    //            pages: Selectors.home.lastState().searchResults.results.map { item in
    //                MapResultRestaurantCard(
    //                    restaurant: RestaurantItem(
    //                        id: item.id,
    //                        name: item.name,
    //                        imageName: "turtlerock",
    //                        address: "",
    //                        phone: "",
    //                        tags: [],
    //                        rating: 8
    //                    )
    //                )
    //            }
    //        )
    //        .frame(width: Screen.width, height: cardRowHeight - 40 + extraHeight)
    //        .offset(y: -extraHeight + 10)
}

struct MapResultRestaurantCard: View, Identifiable {
    var restaurant: RestaurantItem
    var id: String { self.restaurant.id }
    var body: some View {
        DishRestaurantCard(
            restaurant: self.restaurant,
            isMini: true,
            at: .end
        )
            .frame(width: Screen.width - 40, height: cardRowHeight - 40 + extraHeight)
    }
}


struct HomeContentExplore: View {
    @State var index: Int = 0
    
    var body: some View {
        ZStack {
            ScrollViewEnhanced(
                index: self.$index,
                direction: Axis.Set.horizontal,
                showsIndicators: false,
                pages: [0, 1].map { index in
                    HomeContentExploreBy(
                        active: index == self.index,
                        type: index == 0 ? .dish : .cuisine
                    )
                }
            )
        }
        .edgesIgnoringSafeArea(.all)
        .clipped()
    }
}


struct HomeContentExploreBy: View, Identifiable {
    let id = "HomeContentExploreBy"
    
    @Environment(\.geometry) var appGeometry
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var homeState: HomeViewState
    let items = features.chunked(into: 3)
    let spacing: CGFloat = 14
    
    enum ExploreContentType { case dish, cuisine }
    
    var active: Bool = false
    var type: ExploreContentType
    
    var body: some View {
        ZStack {
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 0) {
                    if active {
                        HomeMainDrawerScrollEffects()
                    }
                    
                    // spacer of whats above it height so it can scoll up to searchbar
                    Spacer().frame(
                        height: App.searchBarHeight / 2 + App.filterBarHeight + self.homeState.scrollRevealY
                        // why
                         - 10
                    )
                    
                    VStack(spacing: self.spacing) {
                        ForEach(0 ..< self.items.count) { index in
                            HStack(spacing: self.spacing) {
                                ForEach(self.items[index]) { item in
                                    DishCardView(
                                        dish: item,
                                        at: .start,
                                        display: .full,
                                        height: 100
                                    )
                                        .equatable()
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                    
                    Spacer().frame(height: 20)
                    Spacer().frame(height: homeState.mapHeight - self.homeState.scrollRevealY)
                }
                .introspectScrollView { scrollView in
                    if self.active {
                        self.homeState.setActiveScrollView(scrollView)
                    }
                    //                    TODO attempt to have the content scroll pull down when at top
                    //                    scrollView.bounces = false
                }
            }
            .frame(width: appGeometry?.size.width, height: appGeometry?.size.height)
        }
        .edgesIgnoringSafeArea(.all)
        .clipped()
    }
}

struct HomeMainDrawerScrollEffects: View {
    @EnvironmentObject var homeState: HomeViewState

    var body: some View {
        Color.clear
//        ScrollListener(throttle: 12.0) { frame in
//            self.homeState.setScrollY(frame)
//        }
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
                ForEach(self.store.state.home.viewStates) { state in
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


// scroll view enhanced version start:

//struct HomeMapExplore: View {
//    @EnvironmentObject var store: AppStore
//    @State var index: Int = 0
//
//    var body: some View {
//        ScrollViewEnhanced(
//            index: self.$index,
//            direction: .horizontal,
//            showsIndicators: false,
//            pages: (0..<features.count).map { index in
//                MapResultDishCard(dish: features[index])
//            }
//        )
//            .frame(width: Screen.width, height: cardRowHeight)
//        //        .padding(20)
//    }
//}

//struct MapResultDishCard: View, Identifiable {
//    var dish: DishItem
//    var id: Int { self.dish.id }
//
//    var body: some View {
//        DishCardView(
//            dish: dish,
//            at: .end,
//            display: .card
//        )
//            .frame(width: 150, height: cardRowHeight - 40)
//    }
//}
