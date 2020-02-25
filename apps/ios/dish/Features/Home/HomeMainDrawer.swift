import SwiftUI
import Combine

fileprivate let topContentHeight = App.filterBarHeight + 18

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
        let isOnLocationSearch = self.store.state.home.searchFocus == .location
        
        return BottomDrawer(
            position: self.drawerPosition,
            background: Color(.systemBackground),
            snapPoints: App.drawerSnapPoints,
            cornerRadius: 20,
            handle: nil,
            onChangePosition: { (_, y) in
                homeViewState.setY(y)
            },
            onDragState: { state in
                if state.isDragging != self.store.state.home.drawerIsDragging {
                    self.store.send(.home(.setDrawerIsDragging(state.isDragging)))
                }
            }
        ) {
            HomeMainDrawerContentContainer(
                isOnLocationSearch: isOnLocationSearch
            )
        }
    }
}

struct HomeMainDrawerContentContainer: View {
    @EnvironmentObject var screen: ScreenModel
    @State var scrollView: UIScrollView? = nil
    var isOnLocationSearch: Bool
    
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
        return ZStack {
            // home content
            ZStack {
                VStack(spacing: 0) {
                    Spacer().frame(height: App.searchBarHeight)
                    HomeMainDrawerContent()
                        .mask(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color.black.opacity(0),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1),
                                    Color.black.opacity(1)
                                ]),
                                startPoint: .top,
                                endPoint: .center
                            )
                                .offset(y: App.searchBarHeight)
                        )
                    Spacer()
                }
                VStack(spacing: 0) {
                    VStack(spacing: 0) {
                        HomeSearchBar()
                            .padding(.horizontal, 10)
                            .padding(.top, 10)
                        HomeMainFilterBar()
                    }
                    Spacer()
                }
            }
            .opacity(isOnLocationSearch ? 0 : 1)
        }
    }
}


struct HomeMainDrawerContent: View {
    @EnvironmentObject var store: AppStore

    var body: some View {
        let viewStates = self.store.state.home.viewStates
        print("viewStates \(viewStates.count)")
        return ZStack {
            ForEach(viewStates) { viewState in
                HomeScreen(
                    index: viewStates.firstIndex(of: viewState) ?? 0,
                    isActive: Selectors.home.lastState() == viewState,
                    isLast: viewStates.firstIndex(of: viewState) == viewStates.count - 1,
                    onSwipeBack: {
                        self.store.send(.home(.pop))
                    },
                    viewState: viewState
                )
            }
        }
    }
}

struct HomeScreen: View, Identifiable {
    @EnvironmentObject var screen: ScreenModel
    @State var dragX: CGFloat = 0
    
    var id: String { self.viewState.id }
    var index: Int
    var isActive: Bool
    var isLast: Bool
    var onSwipeBack: () -> Void
    var viewState: HomeStateItem
    
    var body: some View {
        print("render home screen \(index) \(viewState.search)")
        return ZStack {
            if isActive {            
                if index == 0 {
                    HomeContentExplore()
                } else {
                    HomeSearchResultsView(state: viewState)
                }
            }
            
            if isLast {
                HStack {
                    Color.black.opacity(0.00001).frame(width: 40)
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { value in
                                    // left edge
                                    if value.startLocation.x < 20 {
                                        self.dragX = value.translation.width
                                    }
                            }
                            .onEnded { value in
                                let frameWidth = self.screen.width
                                let offset = value.translation.width / frameWidth
                                let offsetV = value.predictedEndTranslation.width / frameWidth
                                let score = abs(offset * 0.4 + offsetV * 0.6)
                                let shouldChange = score > 0.2
                                withAnimation(.spring()) {
                                    self.dragX = shouldChange ? frameWidth : 0
                                }
                            }
                    )
                    Spacer()
                }
            }
        }
    }
}

struct HomeContentPadAbove: View {
    var body: some View {
        return Spacer().frame(height: topContentHeight)
    }
}

struct HomeContentPadBelow: View {
    @EnvironmentObject var screen: ScreenModel
    var body: some View {
        Spacer().frame(height: 5 + self.screen.edgeInsets.bottom)
    }
}

struct IdentifiableView<Content>: View, Identifiable where Content: View {
    var id: String
    var content: () -> Content
    
    init(id: String, @ViewBuilder content: @escaping () -> Content) {
        self.id = id
        self.content = content
    }
    
    var body: some View {
        self.content()
    }
}

struct HomeContentExplore: View {
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    let dishes = features
    let testListView = false
    let id = UUID().uuidString
    
    var lense: LenseItem {
        Selectors.home.activeLense(self.store)
    }
    
    var title: String {
        lense.description ?? ""
    }
    
    @State var searchDishes = true
    
    var titleView: some View {
        Group {
            if self.store.state.home.searchFocus != .search {
                HStack(spacing: 6) {
                    Text(self.title)
                        .style(.h1)
                        .foregroundColor(lense.color)
                    
                    DishButton(action: {
                        self.searchDishes = !self.searchDishes
                    }) {
                        Text(searchDishes ? "dishes 🍽" : "restaurants")
                            .fontWeight(.light)
                            .style(.h1)
                            .opacity(0.5)
                    }
                    
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.bottom)
                .transition(.slide)
                .animation(.ripple())
            }
        }
    }
    
    var listView: some View {
        var items: [IdentifiableView<AnyView>] = [
            IdentifiableView(id: "0") { AnyView(HomeContentPadAbove()) },
            IdentifiableView(id: "1") { AnyView(self.titleView) }
        ]
        
        items = items + (0 ..< self.dishes.count).map { index in
            let dish = self.dishes[index]
            return IdentifiableView(id: "dish-\(dish.id)") {
                AnyView(DishListItem(
                    number: index + 1,
                    dish: self.dishes[index]
                )
                    .transition(.slide)
                    .animation(.ripple(index: index))
                )
            }
        }
        
        items = items + [
            IdentifiableView(id: "3") { AnyView(HomeContentPadBelow()) }
        ]
        
        return List(items) { item in
            item
                .listRowInsets(EdgeInsets())
        }
        .id(self.id)
    }
    
    @State var lastScrollStartedAt: CGFloat = 0
    
    let state = ScrollState()
    class ScrollState: ObservableObject {
        @Published var lastY: CGFloat = 0
    }
    
    @State var cancellables: Set<AnyCancellable> = []

    var body: some View {
        let isDisabled = self.store.state.home.drawerIsDragging
        
        return Group {
            if testListView {
                self.listView
            } else {
                ZStack {
                    Color.clear.onAppear {
                        self.state.$lastY
                            .throttle(for: .milliseconds(4), scheduler: App.queueMain, latest: false)
                            .collect(.byTimeOrCount(App.queueMain, 1, 4))
                            .sink { lastFew in
                                let x: [CGFloat] = lastFew
                                // if pulling it down
//                                print("now \(y)")
                                if x.allSatisfy({ $0 < -11 }) {
                                    self.store.send(.home(.setDrawerPosition(.middle)))
                                }
                            }
                            .store(in: &self.cancellables)
                    }
                    GeometryReader { geo in
                        ScrollView(.vertical, showsIndicators: false) {
                            ScrollListener(debounce: 50) { frame in
                                self.lastScrollStartedAt = self.state.lastY
                            }
                            ScrollListener(throttle: 16) { frame in
                                if self.lastScrollStartedAt == 0
                                    && self.store.state.home.drawerPosition == .top {
                                    self.state.lastY = geo.frame(in: .global).minY - frame.minY
                                }
                            }
                            
                            VStack(spacing: 0) {
                                HomeContentPadAbove()
                                self.titleView
                                ForEach(0..<self.dishes.count) { index in
                                    DishListItem(
                                        number: index + 1,
                                        dish: self.dishes[index]
                                    )
                                        .equatable()
                                        .transition(.slide)
                                        .animation(.ripple(index: index))
                                }
                                HomeContentPadBelow()
                            }
                        }
                        .disabled(isDisabled)
                        .allowsHitTesting(!isDisabled)
                        .frame(width: self.screen.width, alignment: .leading)
                        .clipped()
                    }
                }
                }
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

