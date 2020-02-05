import SwiftUI

fileprivate let debugGeometry = true
let emptyView: AnyView = AnyView(EmptyView())

struct PrintGeometryView: View {
    let name: String
    
    init(_ name: String) {
        self.name = name
    }
    
    var body: some View {
        return debugGeometry
            ? AnyView(GeometryReader { g in
                SideEffect("PrintGeometryView") { print("GEOMETRY \(self.name) WIDTH \(g.size.width) HEIGHT \(g.size.height)") }
            })
            : emptyView
    }
}

struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}

