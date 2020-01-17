import SwiftUI
import Combine

fileprivate class MagicItemsStore: ObservableObject {
    enum MoveState {
        case start, animate, done
    }
    
    @Published var position: MagicItemPosition = .start
    @Published var state: MoveState = .done
    
    var nextPosition: MagicItemPosition = .start
    var startItems = [String: MagicItemDescription]()
    var endItems = [String: MagicItemDescription]()
    
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

fileprivate let magicItems = MagicItemsStore()
fileprivate var lastPosition: MagicItemPosition = .start

struct MagicMove<Content>: View where Content: View {
    let content: () -> Content
    @State var lastContent: Content?
    @State var lastRun: NSDate? = nil
    @State var position: MagicItemPosition = .start
    @ObservedObject fileprivate var store = magicItems
    var animation: Animation
    
    init(
        _ position: MagicItemPosition,
        run: NSDate? = nil,
        duration: Double = 1000,
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
        let keys = magicItems.startItems.map { $0.key }
        let startValues = magicItems.startItems.map { $0.value }
        let endValues = magicItems.endItems.map { $0.value }
        
        return ZStack {
            content()
            
            if store.state != .done {
                ZStack(alignment: .topLeading) {
                    ForEach(keys.indices) { index -> AnyView in
                        if index == 0 { print("loop") }

                        let start = startValues[index]
                        guard let end = endValues.first(where: { $0.id == startValues[index].id }) else {
                            return AnyView(start.view)
                        }
                        
                        let animateItem: MagicItemDescription =
                            self.store.position == .start ? start : end
                        let animatePosition =
                            (self.store.nextPosition == .start ? start : end).frame
                        
                        if index == 0 {
                            print("do it \(animatePosition.minY)")
                        }
                        
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
        .edgesIgnoringSafeArea(.all)
    }
}

enum MagicItemPosition {
    case start, end
}

fileprivate struct MagicItemDescription {
    var view: AnyView
    var frame: CGRect
    var id: String
    var at: MagicItemPosition
}

struct MagicItem<Content>: View where Content: View {
    @ObservedObject fileprivate var store = magicItems

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
//        print("what now yo \(id) \(at) \(self.store.position)")
        return self.content
            .opacity(
                self.store.state == .animate ? 0 :
                    self.store.position == at ? 1 : 0
            )
            .overlay(
                GeometryReader { geometry in
                    Run {
                        let frame = geometry.frame(in: .global)
                        let item = MagicItemDescription(
                            view: self.contentView,
                            frame: frame,
                            id: self.id,
                            at: self.at
                        )
                        if self.at == .start {
                            magicItems.startItems[self.id] = item
                        } else {
                            magicItems.endItems[self.id] = item
                        }
                    }
                }
        )
    }
}
