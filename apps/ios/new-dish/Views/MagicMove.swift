import SwiftUI
import Combine

fileprivate class MagicItemsStore: ObservableObject {
    enum MoveState {
        case start, end, done
    }
    
    @Published var position: MagicItemPosition = .start
    @Published var state: MoveState = .done
    
    var startItems = [String: MagicItemDescription]()
    var endItems = [String: MagicItemDescription]()
    
    let delay = 500.0
    
    func animate(_ position: MagicItemPosition) {
        print("magicmove \(position)")
        async(8) {
            self.state = .start
            async(100 + self.delay) {
                self.state = .end
            }
            async(1000 + self.delay) {
                self.state = .done
                self.position = position
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
    
    init(_ position: MagicItemPosition, run: NSDate? = nil, animation: Animation = .spring(response: 0.3), @ViewBuilder content: @escaping () -> Content) {
        self.content = content
        self.animation = animation
        self.lastContent = content()
        self.position = position
        if position != lastPosition {
            lastPosition = position
            self.lastRun = run
            store.animate(position)
        }
        else if run != nil && self.lastRun != run {
            self.lastRun = run
            store.animate(position)
        }
    }
    
    var body: some View {
        let keys = magicItems.startItems.map { $0.key }
        let values = magicItems.startItems.map { $0.value }
        let endValues = magicItems.endItems.map { $0.value }
        
        return ZStack {
            content()
            
            if store.state != .done {
                ZStack(alignment: .topLeading) {
                    ForEach(keys.indices) { index -> AnyView in
                        let start = values[index]
                        guard let end = endValues.first(where: { $0.id == values[index].id }) else {
                            return AnyView(start.view)
                        }
                        
                        let cur: MagicItemDescription = self.store.state == .start ? start : end
                        
                        return AnyView(
                            // what is alignment
                            HStack {
                                VStack {
                                    VStack {
                                        start.view
                                    }
                                    .frame(
                                        width: cur.frame.width,
                                        height: cur.frame.height
                                    )
                                        .offset(
                                            x: cur.frame.minX,
                                            y: cur.frame.minY
                                    )
                                        .animation(self.animation)
                                    
                                    Spacer()
                                }
                                Spacer()
                            }
                        )
                    }
                }
                .background(Color.red.opacity(0.5))
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
        print("what now yo \(id) \(at) \(self.store.position)")
        return self.content
            .opacity(self.store.position == at ? 1 : 0)
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
