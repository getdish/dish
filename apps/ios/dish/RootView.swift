import SwiftUI

struct RootView: View {
  @EnvironmentObject var store: AppStore
  @Environment(\.geometry) var appGeometry

  func start() {
    async(50) {
      self.store.send(.setAppLoaded)
      async(2000) {
        self.store.send(.hideSplash)
      }
    }
  }

  var body: some View {
    let size: CGFloat = self.store.state.showSplash
      ? 1000
      : 0

    return ZStack {
      Color.black

      PrintGeometryView("RootView")
      Color.clear.onAppear {
        self.start()
      }

      VStack {
        if appGeometry != nil {
          HomeView()
        }
      }

      ZStack {
        Color("color-brand-background")
          .frame(width: size, height: size)
          .cornerRadius(1000)
          .frameLimitedToScreen()
          .animation(.spring())

        VStack {
          if self.store.state.showSplash {
            VStack {
              Image("LaunchScreen2")
                .resizable()
                .scaledToFill()
                .mask(
                  Circle().frame(width: 200, height: 200)
                )
            }
              .transition(.fly)
          }
        }
      }
        .frameLimitedToScreen()
    }
  }
}

extension AnyTransition {
  static var flipVertical: AnyTransition {
    AnyTransition.modifier(
      active: RotationModifier(degrees: 0, x: 0),
      identity: RotationModifier(degrees: 45, x: 1)
    )
  }
}

struct RotationModifier: ViewModifier {
  var degrees: Double = 45
  var x: CGFloat = 0
  var y: CGFloat = 0
  var z: CGFloat = 0

  func body(content: Content) -> some View {
    content.rotation3DEffect(.degrees(degrees), axis: (x, y, z))
  }
}

extension AnyTransition {
  static var fly: AnyTransition {
    AnyTransition.modifier(active: FlyTransition(pct: 0), identity: FlyTransition(pct: 1))
  }
}

struct FlyTransition: GeometryEffect {
  var pct: Double

  var animatableData: Double {
    get { pct }
    set { pct = newValue }
  }

  func effectValue(size: CGSize) -> ProjectionTransform {

    let rotationPercent = pct
    let a = CGFloat(Angle(degrees: 90 * (1 - rotationPercent)).radians)

    var transform3d = CATransform3DIdentity
    transform3d.m34 = -1 / max(size.width, size.height)

    transform3d = CATransform3DRotate(transform3d, a, 1, 0, 0)
    transform3d = CATransform3DTranslate(transform3d, -size.width / 2.0, -size.height / 2.0, 0)

    let affineTransform1 = ProjectionTransform(
      CGAffineTransform(translationX: size.width / 2.0, y: size.height / 2.0))
    let affineTransform2 = ProjectionTransform(
      CGAffineTransform(scaleX: CGFloat(pct * 2), y: CGFloat(pct * 2)))

    if pct <= 0.5 {
      return ProjectionTransform(transform3d).concatenating(affineTransform2).concatenating(
        affineTransform1)
    } else {
      return ProjectionTransform(transform3d).concatenating(affineTransform1)
    }
  }
}
