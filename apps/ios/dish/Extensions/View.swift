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
  func cornerRadius(_ radius: CGFloat, antialiased: Bool = true, corners: UIRectCorner) -> some View
  {
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

  func shadowNeomorphic(
    cornerRadius: CGFloat = 15.0,
    themeColor: UIColor = UIColor(red: 241 / 255, green: 243 / 255, blue: 246 / 255, alpha: 1.0),
    shadowRadius: CGFloat = 3.0,
    shadowOffset: CGFloat? = nil
  ) -> some View {
    let so = shadowOffset ?? shadowRadius
    return
      self
      .shadow(
        color: Color.init(red: 223 / 255, green: 223 / 255, blue: 223 / 255), radius: shadowRadius,
        x: so, y: so)
      .shadow(color: .white, radius: shadowRadius, x: -so, y: -so)
  }

  func onGeometryFrameChange(_ callback: @escaping (CGRect) -> Void) -> some View {
    var last: CGRect? = nil
    return self.overlay(
      GeometryReader { proxy -> Color in
        let next = proxy.frame(in: .global)
        if last != next {
          last = next
          async {
            callback(next)
          }
        }
        return Color.clear
      }
    )
  }

  func onGeometrySizeChange(_ callback: @escaping (CGSize) -> Void) -> some View {
    var last: CGSize = .zero
    return self.overlay(
      GeometryReader { proxy -> Color in
        let next = proxy.size
        if next != last {
          last = next
          async {
            callback(next)
          }
        }
        return Color.clear
      }
    )
  }

  func embedInAppEnvironment(_ initialStore: AppStore? = nil) -> some View {
    if let store = initialStore {
      App.storeVal = store
    }
    return
      self
      .environmentObject(initialStore ?? App.store)
      .environmentObject(App.keyboard)
      .environmentObject(homeViewState)
      .embedInScreen(App.screen)
      .embedInGeometryReader()
      .edgesIgnoringSafeArea(.all)
  }

  func borderRounded(
    radius: CGFloat = 12,
    width: CGFloat = 1,
    color: Color = Color.gray
  ) -> some View {
    self.overlay(
      RoundedRectangle(cornerRadius: radius)
        .stroke(color, lineWidth: width)
    )
  }

  func cornerRadiusSquircle(_ radius: CGFloat) -> some View {
    clipShape(
      RoundedRectangle(cornerRadius: radius, style: .continuous)
    )
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
    let path = UIBezierPath(
      roundedRect: rect, byRoundingCorners: corners,
      cornerRadii: CGSize(width: radius, height: radius))
    return Path(path.cgPath)
  }
}

struct ResignKeyboardOnDragGesture: ViewModifier {
  var gesture = DragGesture().onChanged { _ in
    print("resign keyboard drag")
    UIApplication.shared.endEditing(true)
  }

  func body(content: Content) -> some View {
    content.gesture(gesture)
  }
}

extension View {
  func floatingButtonStyle() -> some View {
    self.padding(.all, 16)
      .background(
        BlurView(style: .systemMaterialDark)
    )
      .background(
        LinearGradient(
          gradient: Gradient(colors: [
            Color.white.opacity(0.4),
            Color.white.opacity(0.5),
          ]),
          startPoint: .top,
          endPoint: .bottom
        )
    )
      .cornerRadius(80)
      .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
      .overlay(
        RoundedRectangle(cornerRadius: 80)
          .stroke(Color.white.opacity(0.5), lineWidth: 1)
    )
  }
}


extension View {
  func controlButtonStyle() -> some View {
    modifier(ControlsButtonStyle())
  }
}


struct ControlsButtonStyle: ViewModifier {
  @Environment(\.colorScheme) var colorScheme
  
  var active: Bool = false
  var background: Color = .clear
  var blurBackground: UIBlurEffect.Style? = .systemUltraThinMaterialLight
  var cornerRadius: CGFloat = 9
  var height: CGFloat = 34
  var hPad: CGFloat = 11
  
  func body(content: Content) -> some View {
    ZStack {
      Group {
        if colorScheme == .dark {
          content
            .frame(height: self.height)
            .padding(.horizontal, self.hPad)
            .foregroundColor(.white)
            .background(Color.black.opacity(active ? 0 : 0.3))
            .background(blurBackground != nil ? BlurView(style: blurBackground!) : nil)
        } else {
          content
            .frame(height: self.height)
            .padding(.horizontal, self.hPad)
            .background(Color.white.opacity(active ? 0 : 0.2))
            .foregroundColor(Color(white: 0, opacity: 0.5))
            .background(blurBackground != nil ? BlurView(style: blurBackground!) : nil)
        }
      }
      .background(self.background)
      .innerGlow(color: Color.white.opacity(0.025), radius: 30)
      .cornerRadiusSquircle(cornerRadius)
      .shadow(color: Color.black.opacity(0.35), radius: 1, x: 0, y: 1)
    }
    .padding(3)
  }
}
