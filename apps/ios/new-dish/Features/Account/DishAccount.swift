import SwiftUI

struct DishAccount: View {
    var body: some View {
        ZStack {
            Color.black
            
            LoginSignupView()
        }
        .environment(\.colorScheme, .dark)
    }
}
