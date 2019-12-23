import SwiftUI

// ratio of dish-brandmark w/h
//fileprivate let brandRatio: CGFloat = 1.373881932

struct TopNavMenuButton: View {
    var body: some View {
        Button(action: {
            //            Store.home.showMenuDrawer.toggle()
        }) {
            HStack {
                Image("dish-icon")
                    .resizable()
                    .frame(width: 28, height: 28)
                    .padding(4)
            }
            .background(Color(.secondarySystemBackground))
            .cornerRadius(40)
            .shadow(color: Color.black.opacity(0.35), radius: 5, x: 0, y: 4)
        }
    }
}
