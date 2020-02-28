import SwiftUI
import Combine

fileprivate let topContentHeight = App.filterBarHeight + 18

struct HomeMainDrawer: View, Equatable {
    static func == (lhs: HomeMainDrawer, rhs: HomeMainDrawer) -> Bool {
        true
    }

    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var colorScheme
    
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
    
    var drawerBackgroundColor: Color {
        Selectors.home.drawerColor(colorScheme: self.colorScheme)
    }
    
    var body: some View {
        let isOnLocationSearch = self.store.state.home.searchFocus == .location
        
//        self.colorScheme == .dark
//            ? Color.init(white: 0.075)
//            : Color.white
        
        return BottomDrawer(
            position: self.drawerPosition,
            background: self.drawerBackgroundColor,
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
        .environment(\.drawerBackgroundColor, self.drawerBackgroundColor)
        .environment(\.lenseColor, Selectors.home.activeLense().color)
    }
}

struct HomeMainDrawerContentContainer: View {
    var isOnLocationSearch: Bool

    var body: some View {
        let occludeTopHeight = App.searchBarHeight + 13
        return ZStack {
            // home content
            ZStack {
                VStack(spacing: 0) {
                    Spacer().frame(height: occludeTopHeight)
                    HomeMainDrawerContent()
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
                                .offset(y: occludeTopHeight)
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
    
    func onSwipeBack() {
        self.store.send(.home(.pop))
    }

    var body: some View {
        let viewStates = self.store.state.home.viewStates
        return ZStack {
            ForEach(viewStates, id: \.id) { viewState in
                HomeScreen(
                    index: viewStates.firstIndex(of: viewState) ?? 0,
                    isActive: Selectors.home.lastState() == viewState,
                    isLast: viewStates.firstIndex(of: viewState) == viewStates.count - 1,
                    onSwipeBack: self.onSwipeBack,
                    viewState: viewState
                )
                .equatable()
            }
        }
    }
}

struct HomeScreen: View, Identifiable, Equatable {
    static func == (l: Self, r: Self) -> Bool {
        l.id == r.id && l.index == r.index && l.isActive == r.isActive && l.isLast == r.isLast
    }
    
    @EnvironmentObject var screen: ScreenModel
    @State var dragX: CGFloat = 0
    
    var id: String { self.viewState.id }
    var index: Int
    var isActive: Bool
    var isLast: Bool
    var onSwipeBack: () -> Void
    var viewState: HomeStateItem
    let uid = UUID().uuidString
    
    var body: some View {
        print("render home screen \(index) --  \(uid) -- \(isActive) \(viewState.state)")
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
        .frameLimitedToScreen()
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
    let id = UUID().uuidString
    
    var lense: LenseItem {
        Selectors.home.activeLense(self.store)
    }
    
    @State var searchDishes = true
    
    var titleView: some View {
        Group {
            if self.store.state.home.searchFocus != .search {
                HStack(spacing: 6) {
                    Spacer()
                    
                    Text(lense.description ?? "")
                        .style(.smallCapsSmallTitle)
                        .foregroundColor(lense.color)
                    
                    DishButton(action: {
                        self.searchDishes = !self.searchDishes
                    }) {
                        Text(searchDishes ? "dishes 🍽" : "restaurants")
                            .fontWeight(.semibold)
                            .style(.smallCapsSmallTitle)
                            .opacity(0.5)
                    }
                    
                    Text("in SF")
                        .fontWeight(.light)
                        .style(.smallCapsSmallTitle)
                        .opacity(0.5)
                    
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.bottom)
                .transition(.slide)
                .animation(.ripple())
            }
        }
    }
    
    @State var state: ScrollState? = nil
    @State var targetLock: ScrollState.ScrollTargetLock = .idle

    var body: some View {
        let isDisabled = self.store.state.home.drawerIsDragging

        //        self.listView
        return Group {
            ZStack {
                Color.clear.onAppear {
                    self.state = mainContentScrollState
                    self.state!.$scrollTargetLock
                        .map { target in
                            // side effect
                            if target == .drawer {
                                self.state?.scrollView?.panGestureRecognizer.isEnabled = false
                            } else {
                                self.state?.scrollView?.panGestureRecognizer.isEnabled = true
                            }
                            return target
                        }
                        .assign(to: \.targetLock, on: self)
                        .store(in: &self.state!.cancellables)
                }
                
                GeometryReader { geo in
                    ScrollView(.vertical, showsIndicators: false) {
                        Color.clear.introspectScrollView { x in
                            if let state = self.state {
                                state.scrollView = x
                                state.start(self)
                            }
                        }
                        
                        VStack(spacing: 0) {
                            HomeContentPadAbove()
                            
                            self.titleView
                            
                            ForEach(0..<(self.store.state.appLoaded ? self.dishes.count : 5)) { index in
                                DishListItem(
                                    number: index + 1,
                                    dish: self.dishes[index]
                                )
                                    .equatable()
                                    .transition(.slide)
                                    .animation(.ripple(index: index))
                            }
                            .id(self.store.state.appLoaded ? "0" : "1")
                            
                            
                            HomeContentPadBelow()
                        }
                    }
                    .frame(width: self.screen.width, alignment: .leading)
                }
            }
        }
        .disabled(isDisabled)
        .allowsHitTesting(!isDisabled)
        .clipped()
    }
}

let mainContentScrollState = ScrollState()

class ScrollState: NSObject, ObservableObject, UIScrollViewDelegate, UIGestureRecognizerDelegate {
    var scrollInitialY: CGFloat = 0
    var cancellables: Set<AnyCancellable> = []
    var scrollView: UIScrollView? = nil
    @Published var scrollTargetLock: ScrollTargetLock = .idle
    
    enum ScrollTargetLock {
        case content, drawer, idle
    }
    
    var isAbleToPullDrawer: Bool {
        let startedAtTop = round(self.scrollInitialY) == 0
        let drawerIsDownDraggable = App.store.state.home.drawerPosition != .bottom
        return startedAtTop && drawerIsDownDraggable
    }
    
    func scrollViewWillBeginDragging(_ scrollView: UIScrollView) {
        self.scrollInitialY = scrollView.contentOffset.y
        scrollView.bounces = !isAbleToPullDrawer
    }
    
    func scrollViewWillEndDragging(_ scrollView: UIScrollView, withVelocity velocity: CGPoint, targetContentOffset: UnsafeMutablePointer<CGPoint>) {
        async(20) {
            self.scrollTargetLock = .idle
        }
    }
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        isAbleToPullDrawer
    }
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        otherGestureRecognizer.view == scrollView
    }
    
    @objc func panGestureDetected(_ recognizer: UIPanGestureRecognizer) {
        if recognizer.state == .ended {
            self.scrollView?.panGestureRecognizer.isEnabled = true
            if self.scrollTargetLock == .drawer {
                bottomDrawerStore.endPan = .velocity(recognizer.velocity(in: self.scrollView))
                return
            }
        }
        
        let y = recognizer.translation(in: self.scrollView).y
        
        if isAbleToPullDrawer {
            if recognizer.state == .changed {
                if self.scrollTargetLock == .idle {
                    if y > 8 {
                        self.scrollTargetLock = .drawer
                        self.scrollView?.panGestureRecognizer.isEnabled = false
                    }
                    if y < -3 {
                        self.scrollTargetLock = .content
                        self.scrollView?.bounces = true
                    }
                }
            }
        }
        
        if self.scrollTargetLock == .drawer {
            bottomDrawerStore.positionY = y
        }
    }
    
    func start(_ parent: HomeContentExplore) {
        guard let scrollView = self.scrollView else { return }
        scrollView.delegate = self
        let r = UIPanGestureRecognizer.init(target: self, action: #selector(ScrollState.panGestureDetected(_:)))
        r.delegate = self
        scrollView.addGestureRecognizer(r)
    }
}

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


//var listView: some View {
//    var items: [IdentifiableView<AnyView>] = [
//        IdentifiableView(id: "0") { AnyView(HomeContentPadAbove()) },
//        IdentifiableView(id: "1") { AnyView(self.titleView) }
//    ]
//
//    items = items + (0 ..< self.dishes.count).map { index in
//        let dish = self.dishes[index]
//        return IdentifiableView(id: "dish-\(dish.id)") {
//            AnyView(DishListItem(
//                number: index + 1,
//                dish: self.dishes[index]
//            )
//                .transition(.slide)
//                .animation(.ripple(index: index))
//            )
//        }
//    }
//
//    items = items + [
//        IdentifiableView(id: "3") { AnyView(HomeContentPadBelow()) }
//    ]
//
//    return List(items) { item in
//        item
//            .listRowInsets(EdgeInsets())
//    }
//    .id(self.id)
//}
