import SwiftUI

extension View {
    func embedInScreen(_ screen: ScreenModel) -> some View {
        GeometryReader { g in
            return self
                .environmentObject(screen)
                .overlay(
                    Color.clear.introspectViewController { controller in
                        print("insets \(controller.view.safeAreaInsets)")
                        screen.edgeInsets = controller.view.safeAreaInsets
                    }
                )
                .overlay(Run("setScreenSize") {
                    let w = g.size.width
                    let h = g.size.height
                    async {
                        screen.width = w
                        screen.height = h
                    }
                })
        }
    }
}

class ScreenModel: ObservableObject {
    @Published var width: CGFloat = UIScreen.main.bounds.width
    @Published var height: CGFloat = UIScreen.main.bounds.height
    @Published var edgeInsets: UIEdgeInsets = UIEdgeInsets()
    
    var cornerRadius: CGFloat {
        self.edgeInsets.top > 0 ? 38.5 : 0
    }
}
