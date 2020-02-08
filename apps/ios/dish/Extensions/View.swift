import SwiftUI

extension View {
//    public func equatable() -> EquatableView<Self> {
//        return EquatableView(content: self)
//    }
}

extension View {
    // rasterize a layer for performance, really helped on masks
    func rasterize() -> some View {
        self.blur(radius: 0.0001)
    }
    
    // expand view to fit parent
    func frameFlex() -> some View {
        frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    // expand view to no bigger than screen
    func frameLimitedToScreen() -> some View {
        AppGeometryReader { geo in
            self.frame(maxWidth: geo.size.width, maxHeight: geo.size.height)
        }
    }
    
    // easier corner radius
    func cornerRadius(_ radius: CGFloat, antialiased: Bool = true, corners: UIRectCorner) -> some View {
        clipShape(
            RoundedCorner(radius: radius, style: antialiased ? .continuous : .circular, corners: corners)
        )
    }
    
    func resignKeyboardOnDragGesture() -> some View {
        return modifier(ResignKeyboardOnDragGesture())
    }
    
    func eraseToAnyView() -> AnyView {
        AnyView(self)
    }

    func embedInNavigation() -> some View {
        NavigationView { self }
    }

    func embedInGeometryReader() -> some View {
        GeometryReader { geometry in
            self.environment(\.geometry, geometry)
        }
    }

    func embedInScroll(alignment: Alignment = .center) -> some View {
        GeometryReader { proxy in
            ScrollView {
                self.frame(
                    minHeight: proxy.size.height,
                    maxHeight: .infinity,
                    alignment: alignment
                )
            }
        }
    }
    
    func embedInAppEnvironment(_ appState: Store<AppState, AppAction>? = nil) -> some View {
        var res = self
        if let state = appState {
            res = res.environmentObject(state) as! Self
        }
        return res.environmentObject(App.store)
            .environmentObject(App.keyboard)
            .environmentObject(homeViewState)
            .embedInScreen(App.screen)
            .embedInGeometryReader()
            .edgesIgnoringSafeArea(.all)
    }
}

// MARK - onScroll

typealias ScrollCallback = (CGRect) -> Void

extension View {
    func onScroll(_ scrollHandler: @escaping ScrollCallback) -> some View {
        background(
            GeometryReader { geometry -> EmptyView in
                scrollHandler(geometry.frame(in: .global))
                return EmptyView()
            }
        )
    }
}


struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var style: RoundedCornerStyle = .continuous
    var corners: UIRectCorner = .allCorners
    
    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}

struct ResignKeyboardOnDragGesture: ViewModifier {
    var gesture = DragGesture().onChanged{_ in
        print("resign keyboard drag")
        UIApplication.shared.endEditing(true)
    }
    func body(content: Content) -> some View {
        content.gesture(gesture)
    }
}
