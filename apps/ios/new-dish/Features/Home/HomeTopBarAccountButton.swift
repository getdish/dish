import SwiftUI

struct HomeTopBarAccountButton: View {
    var body: some View {
        Button(action: {
            //            Store.home.showMenuDrawer.toggle()
        }) {
            HStack {
                Image(systemName: "person.crop.circle.fill") // ellipsis
                    .resizable()
                    //          .foregroundColor(Color(.secondarySystemFill))
                    .frame(width: 20, height: 20)
                    .padding(6)
            }
            .background(Color(.secondarySystemBackground))
            .cornerRadius(40)
            .shadow(color: Color.black.opacity(0.35), radius: 5, x: 0, y: 4)
        }
    }
}
