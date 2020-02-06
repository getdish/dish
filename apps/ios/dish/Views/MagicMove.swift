import SwiftUI
import Combine

fileprivate let DEBUG_ANIMATION = false
fileprivate let OFF_OPACITY = DEBUG_ANIMATION ? 0.5 : 0

class MagicItemsStore: ObservableObject {
    enum MoveState {
        case start, animate, done
    }
    
    @Published var position: MagicItemPosition = .start
    @Published var state: MoveState = .done
    @Published var triggerUpdate =  NSDate()
    var disableTracking: Bool = false
    
    var clear: () -> Void = {}
    
    var startItems = [String: MagicItemDescription?]() {
        didSet { self.debounceUpdate() }
    }
    var endItems = [String: MagicItemDescription?]() {
        didSet { self.debounceUpdate() }
    }
    
    func debounceUpdate() {
        if disableTracking { return }
        clear()
        var cancel = false
        clear = { cancel = true }
        async(100) {
            if self.disableTracking { return }
            if cancel { return }
            self.triggerUpdate = NSDate()
        }
    }
    
    func animate(_ position: MagicItemPosition, duration: Double, onMoveComplete: (() -> Void)?) {
        self.state = .start
        async(2) {
            self.position = position
            self.state = .animate
            async(duration) {
                self.state = .done
                if let cb = onMoveComplete { cb() }
            }
        }
    }
}

let magicItemsStore = MagicItemsStore()
fileprivate var lastPosition: MagicItemPosition = .start

struct MagicMove<Content>: View where Content: View {
    @Environment(\.geometry) var appGeometry
    let content: () -> Content
    @State var lastContent: Content?
    @State var lastRun: NSDate? = nil
    @State var position: MagicItemPosition = .start
    @ObservedObject var store = magicItemsStore
    var disableTracking: Bool
    var animation: Animation
    var onMoveComplete: (() -> Void)?
    
    init(
        _ position: MagicItemPosition,
        run: NSDate? = nil,
        duration: Double = 500,
        disableTracking: Bool = false,
        onMoveComplete: (() -> Void)? = nil,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.content = content
        self.disableTracking = disableTracking
        self.onMoveComplete = onMoveComplete
        self.animation = .easeInOut(duration: duration / 1000 * ANIMATION_SPEED)
        self.lastContent = content()
        self.position = position
        self.store.disableTracking = disableTracking
        if position != lastPosition {
            lastPosition = position
            self.lastRun = run
            store.animate(position, duration: duration, onMoveComplete: onMoveComplete)
        }
        else if run != nil && self.lastRun != run {
            self.lastRun = run
            store.animate(position, duration: duration, onMoveComplete: onMoveComplete)
        }
    }
    
    var body: some View {
        var startValues: [MagicItemDescription] = []
        var endValues: [MagicItemDescription] = []
        let keys = magicItemsStore.startItems
            .filter { $0.value != nil }
            .filter { startItem in magicItemsStore.endItems.map { $0.value }.contains(where: { $0?.id == startItem.value!.id }) }
            .map { $0.key }
            .sorted()
        
        for key in keys {
            if let startItem = magicItemsStore.startItems[key],
                let endItem = magicItemsStore.endItems[key] {
                startValues.append(startItem!)
                endValues.append(endItem!)
            }
        }
        
//        print("MagicMove --- keys \(keys.count) - startvalues \(startValues.count) - endValues \(endValues.count)")
//        print(" -- start \(startValues.map { $0.id })")
//        print(" -- end \(endValues.map { $0.id })")
        
        return ZStack {
            ZStack(alignment: .topLeading) {
                // debug view
                if DEBUG_ANIMATION {
                    ZStack(alignment: .topLeading) {
                        Color.black.opacity(0.0001)
                        ForEach(0 ..< 40) { index -> AnyView  in
                            if index < startValues.count - 1 {
                                let val = startValues[index]
                                return AnyView(
                                    Color.blue
                                        .opacity(0.5)
                                        .frame(width: val.frame.width, height: val.frame.height)
                                        .offset(x: val.frame.minX, y: val.frame.minY)
                                )
                            }
                            return emptyView
                        }
                        
                        ForEach(0 ..< 40) { index -> AnyView  in
                            if index < endValues.count - 1 {
                                let val = endValues[index]
                                return AnyView(
                                    Color.red
                                        .opacity(0.5)
                                        .frame(width: val.frame.width, height: val.frame.height)
                                        .offset(x: val.frame.minX, y: val.frame.minY)
                                )
                            }
                            return emptyView
                        }
                    }
                    .allowsHitTesting(false)
                    .disabled(true)
                }
                
                content()
            }
            
            if store.state != .done {
                ZStack(alignment: .topLeading) {
                    ForEach(0 ..< keys.count) { index -> AnimatedView in
                        if index >= startValues.count {
                            return AnimatedView()
                        }
                        let start = startValues[index]
                        guard let end = endValues.first(where: { $0.id == startValues[index].id }) else {
                            return AnimatedView()
                        }
                        
                        let animateItem: MagicItemDescription =
                            self.store.position == .start ? start : end
                        let animatePosition =
                            (self.store.position == .start ? start : end).frame
                        
                        return AnimatedView(
                            animation: self.animation,
                            animateItem: animateItem,
                            animatePosition: animatePosition
                        )
                    }
                }
            }
        }
    }
}

struct AnimatedView: View, Identifiable {
    var id: String { self.animateItem?.id ?? "empty---" }
    var animation: Animation = .default
    var animateItem: MagicItemDescription? = nil
    var animatePosition: CGRect? = nil
    
    var body: some View {
        HStack {
            if self.animateItem != nil || self.animatePosition != nil {
                VStack {
                    animateItem!.view
                        .animation(self.animation)
                        .frame(
                            width: self.animatePosition!.width,
                            height: self.animatePosition!.height
                    )
                        .offset(
                            x: self.animatePosition!.minX,
                            y: self.animatePosition!.minY
                    )
                    
                    Spacer()
                }
            }
            Spacer()
        }
    }
}

enum MagicItemPosition {
    case start, end
}

struct MagicItemDescription: Identifiable, Equatable {
    static func == (lhs: MagicItemDescription, rhs: MagicItemDescription) -> Bool {
        lhs.id == rhs.id && lhs.frame.equalTo(rhs.frame) && lhs.at == rhs.at
    }
    
    var view: AnyView
    var frame: CGRect
    var id: String
    var at: MagicItemPosition
}

struct MagicItem<Content>: View where Content: View {
    @ObservedObject fileprivate var store = magicItemsStore
    @Environment(\.geometry) var appGeometry

    let content: Content
    let id: String
    let at: MagicItemPosition
    let contentView: AnyView
    let disableTracking: Bool
    
    init(_ id: String, at: MagicItemPosition, disableTracking: Bool = false, @ViewBuilder content: @escaping () -> Content) {
        self.id = id
        self.at = at
        self.disableTracking = disableTracking
        self.content = content()
        self.contentView = AnyView(self.content)
    }
    
    var items: [String: MagicItemDescription?] {
        self.at == .start ? magicItemsStore.startItems : magicItemsStore.endItems
    }
    
    func updateItem(_ item: MagicItemDescription) {
        if self.at == .start {
            magicItemsStore.startItems[self.id] = item
        } else {
            magicItemsStore.endItems[self.id] = item
        }
    }
    
    var isDisabled: Bool {
        self.disableTracking || magicItemsStore.disableTracking
    }
    
    // split this out because we likely want to run it a frame after
    func setupSideEffect(_ frame: CGRect) -> (String, Bool, MagicItemDescription) {
        // off screen avoid doing things
        let offYN = frame.minY + frame.height < 0
        let offYP = frame.minY > Screen.fullHeight
        let offXN = frame.minX + frame.width < 0
        let offXP = frame.minX > Screen.width
        let offScreen = offYN || offYP || offXN || offXP
        let isOffScreen = self.items[self.id] != nil && offScreen == true
        
        let isMagicStoreAnimating = magicItemsStore.state != .done
        
        let item = MagicItemDescription(
            view: self.contentView,
            frame: frame,
            id: self.id,
            at: self.at
        )
        let curItem = self.items[self.id]
        let hasChanged = curItem != item
        
        let name = "MagicItem \(self.at) \(self.id) -- \(frame.minX) \(frame.minY)"
        let enabled = !self.isDisabled && !isOffScreen && !isMagicStoreAnimating && hasChanged
        
        return (name, enabled, item)
    }

    var body: some View {
        return ZStack {
            self.content
                .overlay(
                    GeometryReader { geometry -> SideEffect in
                        let frame = geometry.frame(in: .global)
                        let (name, enabled, item) = self.setupSideEffect(frame)
                        return SideEffect(name, level: .debug, debounce: 16, condition: { enabled }) {
                            self.updateItem(item)
                        }
                    }
            )
        }
            .opacity(
                self.store.state == .animate ? OFF_OPACITY :
                    self.store.position == at ? 1 : OFF_OPACITY
            )
            .onDisappear {
                print("bye \(self.id)")
                if self.at == .start {
                    magicItemsStore.startItems[self.id] = nil
                } else {
                    magicItemsStore.endItems[self.id] = nil
                }
            }
    }
}
