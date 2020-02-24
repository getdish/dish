import SwiftUI
import Combine

struct HomeMainDrawer: View, Equatable {
    static func == (lhs: HomeMainDrawer, rhs: HomeMainDrawer) -> Bool {
        true
    }
    
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    
    var drawerPosition: Binding<BottomDrawerPosition> {
        Binding<BottomDrawerPosition>(
            get: {
                if self.store.state.home.searchFocus != .off {
                    return .top
                }
                return self.store.state.home.drawerPosition
                
        },
            set: { self.store.send(.home(.setDrawerPosition($0))) }
        )
        
    }
    
    var body: some View {
        let topContentHeight = App.searchBarHeight + App.filterBarHeight + 10
        let isOnLocationSearch = self.store.state.home.searchFocus == .location
        
        return BottomDrawer(
            position: self.drawerPosition,
            snapPoints: App.drawerSnapPoints,
            cornerRadius: 20,
            handle: nil,
            onChangePosition: { (_, y) in
                homeViewState.setY(y)
                if self.store.state.home.searchFocus != .off &&
                    y > App.drawerSnapPoints[0] + 100 {
                    
                }
        }
        ) {
            ZStack {
                // home content
                ZStack {
                    VStack {
                        ScrollView(.vertical, showsIndicators: false) {
                            Spacer().frame(height: topContentHeight)
                            HomeMainDrawerContent()
                            Spacer().frame(height: 5 + self.screen.edgeInsets.bottom)
                        }
                        Spacer()
                    }
                    VStack(spacing: 0) {
                        Color(.systemBackground).frame(height: topContentHeight / 2 + 10)
                        LinearGradient(
                            gradient: .init(colors: [
                                Color(.systemBackground),
                                Color(.systemBackground).opacity(0)
                            ]),
                            startPoint: .top,
                            endPoint: .bottom
                        )
                            .frame(height: topContentHeight / 2)
                        Spacer()
                    }
                    VStack(spacing: 0) {
                        HomeSearchBar()
                            .padding(.horizontal, 10)
                            .padding(.top, 10)
                        HomeMainFilterBar()
                        Spacer()
                    }
                }
                .opacity(isOnLocationSearch ? 0 : 1)
                
                // Location search
//                ZStack {
//                    Text("Search location")
//                    ScrollView {
//                        List {
//                            HStack { Text("Search result") }
//                        }
//                    }
//                }
//                .opacity(isOnLocationSearch ? 1 : 0)
            }
        }
    }
}


struct HomeMainDrawerContent: View {
    @EnvironmentObject var store: AppStore
    @State var dragX: CGFloat = 0

    var body: some View {
        let viewStates = self.store.state.home.viewStates
        print("viewStates \(viewStates.count)")
        return ZStack {
            ForEach(viewStates) { viewState in
                HomeScreen(
                    viewState: viewState,
                    isActive: Selectors.home.lastState() == viewState,
                    index: viewStates.firstIndex(of: viewState) ?? 0
                )
            }
            // todo only start on edge
//            .gesture(
//                DragGesture()
//                    .onChanged { value in
//                        // right edge
//                        if value.startLocation.x < 10 {
//                            self.dragX = value.translation.width
//                        }
//                }
//                .onEnded { value in
//                    let frameWidth = geometry.size.width
//                    let offset = value.translation.width / frameWidth
//                    let offsetV = value.predictedEndTranslation.width / frameWidth
//                    let score = abs(offset * 0.4 + offsetV * 0.6)
//                    let shouldChange = score > 0.2
//                    withAnimation(.spring()) {
//                        self.dragX = shouldChange ? frameWidth : 0
//                    }
//                }
//            )
        }
    }
}

struct HomeScreen: View, Identifiable {
    var id: String { self.viewState.id }
    @EnvironmentObject var store: AppStore
    var viewState: HomeStateItem
    var isActive: Bool
    var index: Int
    
    var body: some View {
        print("render home screen \(index) \(viewState.search)")
        
        return ZStack {
            Color.white
            
            if index == 0 {
                HomeContentExplore()
            } else {
                HomeSearchResultsView(state: viewState)
            }
        }
    }
}

struct HomeContentExplore: View {
    @EnvironmentObject var store: AppStore
    let dishes = features
    
    var body: some View {
        let title = Selectors.home.activeLense().description ?? ""
        return VStack {
            if self.store.state.home.searchFocus != .search {
                HStack(spacing: 6) {
                    Text(title)
                        .style(.h1)
                    Text("dishes")
                        .fontWeight(.light)
                        .style(.h1)
                        .opacity(0.5)
                    Spacer()
                }
                .padding(.horizontal)
                .transition(.slide)
            }
            
            ForEach(0 ..< self.dishes.count) { index in
                DishListItem(
                    number: index + 1,
                    dish: self.dishes[index]
                )
            }
        }
        .padding(.bottom)
        .padding(.top, 5)
        .animation(.spring())
    }
}

struct DishListItem: View {
    @EnvironmentObject var store: AppStore
    @EnvironmentObject var screen: ScreenModel
    @State var isScrolled: Bool = false
    
    var number: Int
    var dish: DishItem
    var body: some View {
        let imageSize: CGFloat = 60 //isScrolled ? 70 : 60
        
        let image = DishButton(action: {}) {
            dish.image
                .resizable()
                .scaledToFill()
                .frame(width: imageSize, height: imageSize)
                .cornerRadiusSquircle(18)
                .animation(.spring())
        }
        
        return ListItemHScroll(isScrolled: self.$isScrolled) {
            HStack {
                DishButton(action: {
                    App.store.send(
                        .home(.push(HomeStateItem(search: self.dish.name)))
                    )
                }) {
                    HStack {
                        Text("\(self.number).")
                            .font(.system(size: 20))
                            .fontWeight(.bold)
                            .opacity(0.3)
                        
                        Text("\(self.dish.name)")
                            .fontWeight(.light)
                            .lineLimit(1)
                            .font(.system(size: 22))
                        
                        Spacer()
                    }
                    .padding(.horizontal)
                    .frame(width: self.screen.width - 120 - 20)
                }
                
                HStack {
                    image
                    image
                    image
                    image
                }
                .drawingGroup()
                .padding(.trailing)
            }
        }
        .frame(height: imageSize + 10)
        .animation(.spring())
    }
}

struct ListItemHScroll<Content>: View where Content: View {
    @Binding var isScrolled: Bool
    var content: Content
    
    init (isScrolled: Binding<Bool>, @ViewBuilder _ content: @escaping () -> Content) {
        self.content = content()
        self._isScrolled = isScrolled
    }
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            ScrollListener(throttle: 32.0) { frame in
                if frame.minX < 0 && !self.isScrolled {
                    self.isScrolled = true
                } else if frame.minX == 0 && self.isScrolled {
                    self.isScrolled = false
                }
            }
            
            self.content
        }
    }
}

//fileprivate let items = features.chunked(into: 2)

//struct HomeContentExploreBy: View, Identifiable {
//    let id = "HomeContentExploreBy"
//
//    @Environment(\.geometry) var appGeometry
//    @EnvironmentObject var store: AppStore
//    @EnvironmentObject var homeState: HomeViewState
//
//    enum ExploreContentType { case dish, cuisine }
//
//    var active: Bool = false
//    var type: ExploreContentType
//    let items = features.split()
//
//    var body: some View {
//        return ZStack {
////            ScrollView(.vertical, showsIndicators: false) {
//                VStack(alignment: .leading, spacing: 0) {
//                    VStack {
//                        ForEach(0 ..< self.store.state.home.lenses.count) { index in
//                            VStack(alignment: .leading, spacing: 4) {
//                                HStack(spacing: 0) {
//                                    Text("\(self.store.state.home.lenses[index].name)")
//                                        .font(.system(size: 13))
//                                        .fontWeight(.bold)
//                                        .foregroundColor(Color.white)
//                                        .modifier(TextShadowStyle())
//
//                                    // line
//                                    VStack(spacing: 0) {
//                                        Color.white
//                                            .opacity(0.1)
//                                            .frame(height: 1)
//                                        Color.black
//                                            .opacity(0.1)
//                                            .frame(height: 1)
//                                    }
//                                    .padding(.horizontal, 8)
//                                }
//                                .padding(.horizontal)
//
//                                ScrollView(.horizontal, showsIndicators: false) {
//                                    VStack(alignment: .leading, spacing: 10) {
//                                        ForEach(0 ..< self.items.count) { index in
//                                            HStack(spacing: 8) {
//                                                ForEach(self.items[index]) { item in
//                                                    DishButtonView(dish: item, at: .start)
//                                                        .equatable()
//                                                }
//                                                Spacer()
//                                            }
//                                            .padding(.horizontal)
//                                        }
//                                    }
//                                    .padding(.vertical)
//                                }
//
//                                Spacer().frame(height: 8)
//                            }
//                        }
//                    }
//                    .padding(.top, 4)
//                }
////                .introspectScrollView { scrollView in
////                    if self.active {
////                        self.homeState.setActiveScrollView(scrollView)
////                    }
////                    //                    TODO attempt to have the content scroll pull down when at top
////                    //                    scrollView.bounces = false
////                }
////            }
////            .frame(width: appGeometry?.size.width, height: appGeometry?.size.height)
//        }
////        .edgesIgnoringSafeArea(.all)
////        .clipped()
//    }
//}

//struct HomeMainDrawerScrollEffects: View {
//    @EnvironmentObject var homeState: HomeViewState
//
//    var body: some View {
//        ScrollListener(throttle: 32.0) { frame in
//            self.homeState.setScrollY(frame)
//        }
//    }
//}

//struct HomeMainContentContainer<Content>: View where Content: View {
//    @State var animatePosition: MagicItemPosition = .start
//    @State var shouldUpdateMagicPositions: Bool = true
//    var isSnappedToBottom: Bool = false
//    var disableMagicTracking: Bool = false
//    var content: Content
//
//    init(isSnappedToBottom: Bool, disableMagicTracking: Bool, @ViewBuilder content: @escaping () -> Content) {
//        self.isSnappedToBottom = isSnappedToBottom
//        self.disableMagicTracking = disableMagicTracking
//        self.content = content()
//    }
//
//    var body: some View {
//        //        print("📓 self.isSnappedToBottom \(self.isSnappedToBottom) self.animatePosition \(self.animatePosition) disableMagicTracking \(disableMagicTracking)")
//        //        async {
//        //            if self.isSnappedToBottom && self.animatePosition == .start {
//        //                self.animatePosition = .end
//        //            }
//        //            if !self.isSnappedToBottom && self.animatePosition == .end {
//        //                self.animatePosition = .start
//        //            }
//        //        }
//
//        return ZStack(alignment: .topLeading) {
//            PrintGeometryView("HomeMainContent")
//
//            self.content
//
//            //            // ⚠️ be sure to put any animation on this *inside* magic move
//            //            MagicMove(self.animatePosition,
//            //                      duration: homeViewState.snapToBottomAnimationDuration,
//            //                      // TODO we need a separate "disableTracking" in homeStore that is manually set
//            //                      // why? when hitting "map" toggle button when above snapToBottomAt this fails for now
//            //                      disableTracking: disableMagicTracking,
//            //                      onMoveComplete: {
//            //                        if !self.isSnappedToBottom {
//            //                            self.shouldUpdateMagicPositions = true
//            //                        }
//            //                    }
//            //            ) {
//            //
//            //            }
//        }
//    }
//}
//
//// renders on every frame of HomeViewState, so keep it fairly light
//struct HomeMainContent: View {
//    @Environment(\.geometry) var appGeometry
//    @Environment(\.colorScheme) var colorScheme
//    @EnvironmentObject var homeState: HomeViewState
//    @EnvironmentObject var store: AppStore
//
//    @State var animatePosition: MagicItemPosition = .start
//    @State var shouldUpdateMagicPositions: Bool = true
//
//    var body: some View {
//        VStack(spacing: 0) {
//            HomeMainFilterBar()
//            ScrollView {
//                HomeContentExplore()
//            }
//        }
//        //        ZStack(alignment: .topLeading) {
//        //            // results list below map
//        //            VStack(spacing: 0) {
//        //                HomeMainFilterBar()
//        //
//        //                ScrollView {
//        //                    HomeContentExplore()
//        //                }
//        //
//        ////                Group {
//        ////                    if Selectors.home.isOnSearchResults() {
//        ////                        HomeSearchResultsView(
//        ////                            state: Selectors.home.lastState()
//        ////                        )
//        ////                    } else {
//        ////                        HomeContentExplore()
//        ////                    }
//        ////                }
//        ////                .animation(.none)
//        //            }
//        //            .animation(.spring(response: 0.5))
//        //
//        //            // results bar above map
//        ////            VStack {
//        ////                Spacer()
//        ////
//        ////                VStack {
//        ////                    Group {
//        ////                        if Selectors.home.isOnSearchResults() {
//        ////                            HomeMapSearchResults()
//        ////                                .transition(.slide)
//        ////                        } else {
//        ////                            HomeMapExplore()
//        ////                                .transition(.slide)
//        ////                        }
//        ////                    }
//        ////                }
//        ////                .background(
//        ////                    self.colorScheme == .dark
//        ////                      ? LinearGradient(
//        ////                            gradient: Gradient(colors: [.clear, .black]),
//        ////                            startPoint: .top,
//        ////                            endPoint: .center
//        ////                        )
//        ////                      : LinearGradient(
//        ////                            gradient: Gradient(colors: [.clear, .black]),
//        ////                            startPoint: .top,
//        ////                            endPoint: .bottom
//        ////                        )
//        ////                )
//        ////            }
//        ////            .opacity(self.homeState.isSnappedToBottom ? 1 : 0)
//        //        }
//        //        // note! be sure to put any animation on this *inside* magic move
//        //        // or else it messes up the magic move measurement - you can test
//        //        // by turning on MagicMove's fileprivate debug flag to see
//        //        // also: only making it bouncy during drag to avoid more problems
//        //        .animation(.spring(response: 0.38), value: self.homeState.dragState == .idle)
//        //        // .animation(self.homeState.dragState != .idle ? .spring() : .none)
//    }
//}
