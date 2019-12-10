import SwiftUI
import Combine

fileprivate let magicItems = MagicItems()

struct MagicMove<Content>: View where Content: View {
    let content: () -> Content
    @State var lastContent: Content?
    @ObservedObject fileprivate var mi = magicItems
    
    init(animate: Bool, @ViewBuilder content: @escaping () -> Content) {
        self.content = content
        if animate {
            mi.animate()
        } else {
            self.lastContent = content()
        }
        print("init me \(animate) \(magicItems.startItems.count)")
    }
    
    var body: some View {
        let keys = magicItems.startItems.map { $0.key }
        let values = magicItems.startItems.map { $0.value }
        let endValues = magicItems.endItems.map { $0.value }
        
        return ZStack {
            content()
            
            if mi.state != .done {
                ZStack(alignment: .topLeading) {
                    ForEach(keys.indices) { index -> AnyView in
                        let start = values[index]
                        guard let end = endValues.first(where: { $0.id == values[index].id }) else {
                            return AnyView(start.view)
                        }
                        
                        print("\(index). start \(start.id) \(start.frame)")
                        print("\(index). end \(end.id) \(end.frame)")
                        
                        let cur: MagicItemDescription = self.mi.state == .start ? start : end
                        
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
                                        .animation(.spring(response: 0.15))
                                    
                                    Spacer()
                                }
                                Spacer()
                            }
                        )
                    }
                }
                .frameFlex()
                .background(Color.red.opacity(0.5))
            }
        }
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

fileprivate class MagicItems: ObservableObject {
    enum MoveState {
        case start, end, done
    }
    
    @Published var startItems = [String: MagicItemDescription]()
    @Published var endItems = [String: MagicItemDescription]()
    @Published var state: MoveState = .done
    
    func animate() {
        self.state = .start
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(100)) {
            self.state = .end
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(1000)) {
            self.state = .done
        }
    }
}

struct MagicItem<Content>: View where Content: View {
    let content: () -> Content
    let id: String
    let at: MagicItemPosition
    
    init(_ id: String, at: MagicItemPosition, @ViewBuilder content: @escaping () -> Content) {
        self.id = id
        self.at = at
        self.content = content
    }
    
    var body: some View {
        self.content()
            .overlay(
                GeometryReader { geometry in
                    VStack {
                        Spacer()
                    }
                    .frameFlex()
                    .onAppear {
                        DispatchQueue.main.async {
                            let frame = geometry.frame(in: .global)
                            print("frame is \(frame)")
                            let item =  MagicItemDescription(
                                view: AnyView(self.content()),
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
                }
        )
    }
}
