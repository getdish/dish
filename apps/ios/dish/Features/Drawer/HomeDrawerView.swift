import Combine
import SwiftUI

struct HomeDrawerView: View, Equatable {
  static func == (lhs: Self, rhs: Self) -> Bool {
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
  
  @State var lastPosition: BottomDrawerPosition? = nil

  var drawerBackgroundColor: Color {
    self.colorScheme == .dark
      ? Color(white: 0).opacity(0.55)
      : Color(white: 0.8).opacity(1)
  }

  var body: some View {
    let isOnLocationSearch = self.store.state.home.searchFocus == .location
    
    print("drawerPosition \(drawerPosition)")
    
    return BottomDrawer(
      background: self.drawerBackgroundColor,
      cornerRadius: 25,
      handle: nil,
      onChangePosition: { (pos, y) in
        let didChangePos = pos != self.lastPosition
        if didChangePos {
          self.lastPosition = pos
        }
        homeViewState.setY(y, animate: didChangePos)
      },
      onDragState: { state in
        if App.store.state.home.focusedItem != nil {
          App.store.send(.home(.setFocusedItem(nil)))
        }
        if state.isDragging != self.store.state.home.drawerIsDragging {
          self.store.send(.home(.setDrawerIsDragging(state.isDragging)))
        }
      },
      position: self.drawerPosition,
      preventDragAboveSnapPoint: .middle,
      snapPoints: App.drawerSnapPoints
    ) {
      ZStack {
        Spacer()
        
        LinearGradient(
          gradient: .init(
            colors: [Color(white: 0, opacity: 0.6), Color.clear]
          ),
          startPoint: .top,
          endPoint: .center
        )
        
        HomeMainDrawerContent()
        
//        VStack {
//          BlurView(style: .light)
//            .frame(height: 100)
//            .mask(
//              LinearGradient(
//                gradient: Gradient(colors: [.clear, .black]), startPoint: .top, endPoint: .bottom
//              )
//          )
//          Spacer()
//        }
//        .allowsHitTesting(false)
//        .disabled(true)
        
        VStack(spacing: 0) {
          VStack(spacing: 0) {
            HomeDrawerSearchBar()
              .background(
                BlurView(style: .dark)
//                Color.black.opacity(0.6)
              )
            HomeDrawerFilterBar()
          }
          Spacer()
        }
        .opacity(isOnLocationSearch ? 0 : 1)
      }
    }
      .environment(\.drawerBackgroundColor, self.drawerBackgroundColor)
      .environment(\.lenseColor, Selectors.home.activeLense().color)
  }
}


struct HomeMainDrawerContent: View {
  @EnvironmentObject var store: AppStore

  func onSwipeBack() {
    self.store.send(.home(.pop))
  }

  var body: some View {
    let viewStates = self.store.state.home.viewStates
    let occludeTopHeight = App.searchBarHeight
    return VStack(spacing: 0) {
      ZStack {
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
//        .mask(
//          HomeMainDrawerContent.maskGradient.offset(
//            y: occludeTopHeight - (
//              self.store.state.home.showFilters
//                ? -20
//                : -12
//          ))
//        )
    }
  }
  
  static let maskGradient = LinearGradient(
    gradient: Gradient(colors: [
      Color.black.opacity(0),
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
    endPoint: .center
  )
}

let mainContentScrollState = ScrollState()

struct HomeContentScrollView<Content>: View where Content: View {
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  @State var state: ScrollState = mainContentScrollState
  @State var targetLock: ScrollState.ScrollTargetLock = .idle
  var content: Content
  
  init(content: () -> Content) {
    self.content = content()
  }
  
  func start() {
    self.state.$scrollTargetLock
      .map { target in
        // side effect
        if target == .drawer {
          self.state.scrollView?.panGestureRecognizer.isEnabled = false
        } else {
          self.state.scrollView?.panGestureRecognizer.isEnabled = true
        }
        return target
    }
    .assign(to: \.targetLock, on: self)
    .store(in: &self.state.cancellables)
  }
  
  var body: some View {
    let isDisabled = self.store.state.home.drawerIsDragging
    let topContentHeight = App.searchBarHeight + (self.store.state.home.showFilters
      ? App.filterBarHeight : 0)
    
    print("render")
    
    return Group {
      ZStack {
        Color.clear.onAppear(perform: self.start)
        
        GeometryReader { geo in
          ScrollView(.vertical, showsIndicators: false) {
            Color.clear.introspectScrollView { x in
              if self.state.scrollView == nil {
                self.state.scrollView = x
                self.state.start()
              }
            }
            
            ScrollListener(
              name: "HomeContentScroll",
              throttle: 140
            ) { frame in
              App.store.send(.home(.setFocusedItem(nil)))
            }
            
            VStack(spacing: 0) {
              Spacer().frame(height: topContentHeight)
              self.content
              Spacer().frame(height: 5 + self.screen.edgeInsets.bottom + self.screen.height / 2)
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
//    print("render home screen \(index) --  \(uid) -- \(isActive) \(viewState.state)")
    return ZStack {
      if isActive {
        if index == 0 {
          HomeContentScrollView {
            HomeDrawerExploreView()
          }
        } else {
          HomeContentScrollView {
            HomeDrawerSearchResultsView(state: viewState)
          }
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

struct HomeDrawerExploreView: View {
  @Environment(\.colorScheme) var colorScheme
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  let dishes = features

  var total: Int {
    self.store.state.appLoaded ? self.dishes.count : 5
  }

  var body: some View {
    VStack {
      DrawerTitleView()
      ForEach(0..<self.total) { index in
        DishListItem(
          dish: self.dishes[index],
          onScrollStart: {
            // todo reset the others
        }
        )
          .equatable()
      }
      .id(self.store.state.appLoaded ? "0" : "1")
    }
  }
}

struct DrawerTitleView: View {
  @Environment(\.colorScheme) var colorScheme
  @EnvironmentObject var screen: ScreenModel
  @EnvironmentObject var store: AppStore
  
  var lense: LenseItem {
    Selectors.home.activeLense(self.store)
  }
  
  var body: some View {
    let locationName = self.store.state.map.locationLabel
    return Group {
      if self.store.state.home.searchFocus != .search {
        HStack(spacing: 6) {
          Group {
            Text("\(lense.icon) \(lense.name)")
            if locationName != "Map area" {
              Text("in")
              Text("\(locationName)")
            }
          }
          .font(.system(size: 22))
          .foregroundColor(colorScheme == .light ?
            Color(white: 0, opacity: 0.5) : Color(white: 1, opacity: 0.5))

          Spacer()
        }
        .padding(.horizontal)
        .padding(.top, 8)
        .padding(.bottom, 8)
        .transition(.slide)
        .animation(.ripple())
      }
    }
  }
}

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
    print("🙈 scrollViewWillBeginDragging isAbleToPullDrawer \(isAbleToPullDrawer)")
    self.scrollInitialY = scrollView.contentOffset.y
    let bounces = !self.isAbleToPullDrawer
    if bounces != scrollView.bounces {
      scrollView.bounces = bounces
    }
  }

  func scrollViewWillEndDragging(
    _ scrollView: UIScrollView, withVelocity velocity: CGPoint,
    targetContentOffset: UnsafeMutablePointer<CGPoint>
  ) {
    async {
      self.scrollTargetLock = .idle
      self.scrollView?.panGestureRecognizer.isEnabled = true
    }
  }

  func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch)
    -> Bool
  {
    isAbleToPullDrawer
  }

  func gestureRecognizer(
    _ gestureRecognizer: UIGestureRecognizer,
    shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer
  ) -> Bool {
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

  func start() {
    guard let scrollView = self.scrollView else { return }
    scrollView.delegate = self
    let r = UIPanGestureRecognizer.init(
      target: self, action: #selector(ScrollState.panGestureDetected(_:)))
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
