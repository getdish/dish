import SwiftUI
import Combine

fileprivate let items = features.chunked(into: 2)
fileprivate let labels = ["🔥 Locally", "🍽 Chef Spots", "🍣 Seafood", "🌶 Spice", "🥗 Healthy", "💸 Hole-in-the-wall", "🥩 Meat Lovers"]

struct HomeMainContentContainer<Content>: View where Content: View {
    @State var animatePosition: MagicItemPosition = .start
    @State var shouldUpdateMagicPositions: Bool = true
    var isSnappedToBottom: Bool = false
    var disableMagicTracking: Bool = false
    var content: Content
    
    init(isSnappedToBottom: Bool, disableMagicTracking: Bool, @ViewBuilder content: @escaping () -> Content) {
        self.isSnappedToBottom = isSnappedToBottom
        self.disableMagicTracking = disableMagicTracking
        self.content = content()
    }
    
    var body: some View {
        print("📓 self.isSnappedToBottom \(self.isSnappedToBottom) self.animatePosition \(self.animatePosition) disableMagicTracking \(disableMagicTracking)")
        
        async {
            if self.isSnappedToBottom && self.animatePosition == .start {
                self.animatePosition = .end
            }
            if !self.isSnappedToBottom && self.animatePosition == .end {
                self.animatePosition = .start
            }
        }
        
        return ZStack(alignment: .topLeading) {
            PrintGeometryView("HomeMainContent")
            
            // ⚠️ be sure to put any animation on this *inside* magic move
            MagicMove(self.animatePosition,
                      duration: homeViewState.snapToBottomAnimationDuration,
                      // TODO we need a separate "disableTracking" in homeStore that is manually set
                      // why? when hitting "map" toggle button when above snapToBottomAt this fails for now
                      disableTracking: disableMagicTracking,
                      onMoveComplete: {
                        if !self.isSnappedToBottom {
                            self.shouldUpdateMagicPositions = true
                        }
                    }
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
                Group {
                    if Selectors.home.isOnSearchResults() {
                        HomeSearchResultsView(
                            state: Selectors.home.lastState()
                        )
                    } else {
                        HomeContentExplore()
                    }
                }
                .animation(.none)
            }
            .offset(y:
                self.homeState.mapHeight - self.homeState.searchBarYExtra + (
                    self.homeState.isSnappedToBottom
                        ? 100
                        : 0
                )
            )
            .frameLimitedToScreen()
            .clipped()
            .animation(.spring(response: 0.5))
            
            // results bar below map
            VStack {
                Spacer()
                
                if Selectors.home.isOnSearchResults() {
                    HomeMapSearchResults()
                } else {
                    HomeMapExplore()
                }
                
                // bottom pad
                Spacer().frame(
                    height: self.homeState.appHeight - self.homeState.snappedToBottomMapHeight + App.searchBarHeight / 2
                )
            }
            .opacity(self.homeState.isSnappedToBottom ? 1 : 0)
        }
        // note! be sure to put any animation on this *inside* magic move
        // or else it messes up the magic move measurement - you can test
        // by turning on MagicMove's fileprivate debug flag to see
        // also: only making it bouncy during drag to avoid more problems
        .animation(.spring(response: 0.38), value: self.homeState.dragState == .idle)
        // .animation(self.homeState.dragState != .idle ? .spring() : .none)
    }
}

struct HomeContentExplore: View {
    @State var index: Int = 0
    
    var body: some View {
        ZStack {
            HomeContentExploreBy(
                active: true,
                type: .dish
            )
//            ScrollViewEnhanced(
//                index: self.$index,
//                direction: Axis.Set.horizontal,
//                showsIndicators: false,
//                pages: [0, 1].map { index in
//                    HomeContentExploreBy(
//                        active: index == self.index,
//                        type: index == 0 ? .dish : .cuisine
//                    )
//                }
//            )
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
    let items = features.split()
    
    enum ExploreContentType { case dish, cuisine }
    
    var active: Bool = false
    var type: ExploreContentType
    
    var body: some View {
        ZStack {
            ScrollView(.vertical, showsIndicators: false) {
                VStack(alignment: .leading, spacing: 0) {
                    if active {
                        HomeMainDrawerScrollEffects()
                    }
                    
                    // spacer of whats above it height so it can scoll up to searchbar
                    Spacer().frame(
                        height: App.searchBarHeight / 2 + App.filterBarHeight + self.homeState.scrollRevealY
                        // why
                         - 10
                    )
                    
                    VStack {
                        ForEach(0..<5) { i in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(spacing: 0) {
                                    Text(labels[i])
                                        .font(.system(size: 13))
                                        .fontWeight(.bold)
                                        .foregroundColor(Color.white)
                                        .modifier(TextShadowStyle())
                                    
                                    // line
                                    VStack(spacing: 0) {
                                        Color.white
                                            .opacity(0.1)
                                            .frame(height: 1)
                                        Color.black
                                            .opacity(0.1)
                                            .frame(height: 1)
                                    }
                                    .padding(.horizontal, 8)
                                }
                                .padding(.horizontal)
                                
                                ScrollView(.horizontal, showsIndicators: false) {
                                    VStack(alignment: .leading, spacing: 10) {
                                        ForEach(0 ..< self.items.count) { index in
                                            HStack(spacing: 8) {
                                                ForEach(self.items[index]) { item in
                                                    DishButtonView(dish: item, at: .start)
                                                        .equatable()
                                                }
                                                Spacer()
                                            }
                                            .padding(.horizontal)
                                        }
                                    }
//                                    .drawingGroup()
                                    .padding(.vertical)
                                }
                                
                                Spacer().frame(height: 8)
                            }
                        }
                    }
                    .padding(.top, 4)
                    
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

// 🗺 🗺 🗺  MAP  🗺 🗺 🗺

struct HomeMapExplore: View {
    @EnvironmentObject var store: AppStore
    @State var index = 0
    
    var body: some View {
        VStack(spacing: 0) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 9) {
                    ForEach(0 ..< 4) { index in
                        Button(action: {
                            self.index = index
                        }) {
                            Text(labels[index])
                                .font(.system(size: 17))
                        }
                        .padding(.horizontal, 2)
                        .modifier(TopNavButtonStyle(height: 42))
                        .invertColorScheme(index == self.index)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 9)
                .padding(.top, 12)
            }
            
            ScrollView(.horizontal, showsIndicators: false) {
                VStack {
                    HStack(spacing: 6) {
                        ForEach(0 ..< features.count) { index in
                            DishButtonView(
                                dish: features[index],
                                at: .end
                            ).equatable()
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 6 + 9)
                    .padding(.top, 3)

//                    HStack(spacing: 11) {
//                        ForEach(0 ..< features.count) { index in
//                            DishButtonView(
//                                dish: features[features.count - index - 1],
//                                at: .end
//                            ).equatable()
//                        }
//                    }
//                    .padding(.horizontal, 20)
//                    .padding(.bottom, 18)
//                    .padding(.top, 6)
                }
            }
        }
    }
}

struct HomeMapSearchResults: View {
    @EnvironmentObject var store: AppStore
    @State var index = 0
    
    let width: CGFloat = max(100, (App.screen.width - 40) * 0.35)
    let height: CGFloat = 130
    
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
                            stars: 3
                        ),
                        isMini: true,
                        at: .end,
                        width: self.width,
                        height: self.height
                    )
                }
            }
            .padding(20)
            .frame(height: self.height + 40)
        }
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
    //        .frame(width: App.screen.width, height: cardRowHeight - 40 + extraHeight)
    //        .offset(y: -extraHeight + 10)
}

//struct MapResultRestaurantCard: View, Identifiable {
//    var restaurant: RestaurantItem
//    var id: String { self.restaurant.id }
//    var body: some View {
//        DishRestaurantCard(
//            restaurant: self.restaurant,
//            isMini: true,
//            at: .end
//        )
//            .frame(width: App.screen.width - 40, height: cardRowHeight - 40)
//    }
//}



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
//            .frame(width: App.screen.width, height: cardRowHeight)
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
