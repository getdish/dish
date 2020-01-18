import SwiftUI
import Combine

fileprivate let DEBUG_ANIMATION = true
fileprivate let OFF_OPACITY = DEBUG_ANIMATION ? 0.5 : 0

class MagicItemsStore: ObservableObject {
    enum MoveState {
        case start, animate, done
    }
    
    @Published var position: MagicItemPosition = .start
    @Published var state: MoveState = .done
    @Published var triggerUpdate =  NSDate()
    
    var clear: () -> Void = {}
    
    var nextPosition: MagicItemPosition = .start
    var startItems = [String: MagicItemDescription?]() {
        didSet {
            self.debounceUpdate()
        }
    }
    var endItems = [String: MagicItemDescription?]() {
        didSet {
            self.debounceUpdate()
        }
    }
    
    func debounceUpdate() {
        clear()
        var cancel = false
        clear = { cancel = true }
        async(100) {
            if cancel { return }
            self.triggerUpdate = NSDate()
        }
    }
    
    func animate(_ position: MagicItemPosition, duration: Double) {
        self.state = .start
        async(2) {
            self.nextPosition = position
            self.state = .animate
            async(duration) {
                self.position = position
                self.state = .done
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
    var animation: Animation
    
    init(
        _ position: MagicItemPosition,
        run: NSDate? = nil,
        duration: Double = 500,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.content = content
        self.animation = .linear(duration: duration / 1000)
        self.lastContent = content()
        self.position = position
        if position != lastPosition {
            lastPosition = position
            self.lastRun = run
            store.animate(position, duration: duration)
        }
        else if run != nil && self.lastRun != run {
            self.lastRun = run
            store.animate(position, duration: duration)
        }
    }
    
    var body: some View {
        let startValues = magicItemsStore.startItems.map { $0.value }.filter { $0 != nil }
        let endValues = magicItemsStore.endItems.map { $0.value }.filter { $0 != nil }
        let keys = magicItemsStore.startItems
            .filter { $0.value != nil }
            .filter { startItem in
                endValues.contains(where: { $0!.id == startItem.value!.id })
            }
            .map { $0.key }
        
        print("MagicMove --- keys \(keys.count) - startvalues \(startValues.count) - endValues \(endValues.count)")
        
        return ZStack {
            ZStack(alignment: .topLeading) {
                // debug view
                if DEBUG_ANIMATION {
                    ZStack(alignment: .topLeading) {
                        Color.black.opacity(0.0001)
                        ForEach(0 ..< 100) { index -> AnyView  in
                            if index < startValues.count - 1 {
                                if let val = startValues[index] {
                                    return AnyView(
                                        val.view
                                            .opacity(0.5)
                                            .overlay(Text("\(val.frame.minY)").foregroundColor(.white))
                                            .frame(width: val.frame.width, height: val.frame.height)
                                            .offset(x: val.frame.minX, y: val.frame.minY)
                                    )
                                }
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
                    ForEach(0 ..< keys.count) { index -> AnyView in
                        let start = startValues[index]!
                        guard let end = endValues.first(where: { $0?.id == startValues[index]?.id }) else {
                            return AnyView(EmptyView())
                        }
                        
                        print("\(start.id)")
                        
                        let animateItem: MagicItemDescription =
                            self.store.position == .start ? start : end!
                        let animatePosition =
                            (self.store.nextPosition == .start ? start : end!).frame
                        
                        return AnyView(
                            // what is alignment
                            HStack {
                                VStack {
                                    VStack {
                                        animateItem.view
                                    }
                                    .frame(
                                        width: animatePosition.width,
                                        height: animatePosition.height
                                    )
                                    .offset(
                                        x: animatePosition.minX,
                                        y: animatePosition.minY
                                    )
                                    .animation(self.animation)
                                    Spacer()
                                }
                                Spacer()
                            }
                        )
                    }
                }
            }
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
    
    init(_ id: String, at: MagicItemPosition, @ViewBuilder content: @escaping () -> Content) {
        self.id = id
        self.at = at
        self.content = content()
        self.contentView = AnyView(self.content)
    }

    var body: some View {
        return ZStack {
            self.content
                .overlay(
                    GeometryReader { geometry -> SideEffect in
                        let frame = geometry.frame(in: .global)
                        
                        // off screen avoid doing things
                        let offYN = frame.minY + frame.height < 0
                        let offYP = frame.minY > Screen.fullHeight
                        let offXN = frame.minX + frame.width < 0
                        let offXP = frame.minX > Screen.width
                        let offScreen = offYN || offYP || offXN || offXP
                        
                        let item = MagicItemDescription(
                            view: self.contentView,
                            frame: frame,
                            id: self.id,
                            at: self.at
                        )
                        let items = self.at == .start ? magicItemsStore.startItems : magicItemsStore.endItems
                        let curItem = items[self.id]
                        
                        if curItem != nil && offScreen {
                            return SideEffect("offscreen", level: .debug)
                        }
                        if curItem != item {
                            return SideEffect("MagicItem.set MagicItemDescription", level: .debug, throttle: 0) {
                                if curItem != item {
                                    //                                print("sideeffect MagicItem.items[\(self.id)] = (xy,wh) \(frame.minX.rounded()) x \(frame.minY.rounded()) | \(frame.width.rounded()) x \(frame.height.rounded())")
                                    if self.at == .start {
                                        magicItemsStore.startItems[self.id] = item
                                    } else {
                                        magicItemsStore.endItems[self.id] = item
                                    }
                                }
                            }
                        }
                        return SideEffect.None
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
