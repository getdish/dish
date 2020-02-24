import SwiftUI
import Combine

struct HomeMainDrawer: View, Equatable {
    static func == (lhs: HomeMainDrawer, rhs: HomeMainDrawer) -> Bool {
        true
    }
    
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    @State var scrollView: UIScrollView? = nil
    
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
    
    class HandleScrollView: NSObject, UIGestureRecognizerDelegate {
        init(_ scrollView: UIScrollView) {
            super.init()
            
            let panGesture = UIPanGestureRecognizer.init()
            panGesture.delegate = self
            scrollView.addGestureRecognizer(panGesture)
        }
        
        func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
            print("what")
            return false
        }
        
        func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
            print("should receive???")
            return false
        }
    }
    
    func start() {
        if let scrollView = self.scrollView {
            _ = HandleScrollView(scrollView)
        }
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
            },
            onDragState: { state in
                self.store.send(.home(.setDrawerIsDragging(state.isDragging)))
            }
        ) {
            ZStack {
                // home content
                ZStack {
                    VStack {
                        ScrollView(.vertical, showsIndicators: false) {
                            Spacer().frame(height: topContentHeight)
                                .introspectScrollView { scrollView in
                                    if self.scrollView == nil {
                                        self.scrollView = scrollView
                                        self.start()
                                    }
                                }
                            HomeMainDrawerContent()
                            Spacer().frame(height: 5 + self.screen.edgeInsets.bottom)
                        }
                        .mask(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color.black.opacity(0),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1)
                                ]),
                                startPoint: .top,
                                endPoint: .center
                            )
                                .offset(y: App.searchBarHeight + 10)
                        )
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
    var viewState: HomeStateItem
    var isActive: Bool
    var index: Int
    
    var body: some View {
        print("render home screen \(index) \(viewState.search)")
        return ZStack {
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
                    .animation(.ripple())
            }
            
            ForEach(0 ..< self.dishes.count) { index in
                DishListItem(
                    number: index + 1,
                    dish: self.dishes[index]
                )
                    .equatable()
                    .transition(.slide)
                    .animation(.ripple(index: index))
            }
        }
        .padding(.bottom)
        .padding(.top, 5)
        .animation(.spring())
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

