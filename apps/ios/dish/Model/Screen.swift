import SwiftUI

let Screen = ScreenModel()

extension View {
    func embedInScreen() -> some View {
        GeometryReader { g in
            return self
                .environmentObject(Screen)
                .overlay(
                    Color.clear.introspectViewController { controller in
                        print("insets \(controller.view.safeAreaInsets)")
                        Screen.edgeInsets = controller.view.safeAreaInsets
                    }
                )
                .overlay(Run("setScreenSize") {
                    let w = g.size.width
                    let h = g.size.height
                    async {
                        Screen.width = w
                        Screen.height = h
                    }
                })
        }
    }
}

class ScreenModel: ObservableObject {
    @Published var width: CGFloat = 0
    @Published var height: CGFloat = 0
    @Published var edgeInsets: UIEdgeInsets = UIEdgeInsets()
}
