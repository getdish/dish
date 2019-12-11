import SwiftUI

struct HomeMapControls: View {
    var body: some View {
        VStack {
            HStack {
                Spacer()
                VStack(spacing: 0) {
                    Button(action: {}) { Image(systemName: "plus.magnifyingglass") }
                        .modifier(MapButtonStyle())
                        .cornerRadius(5, antialiased: true, corners: [.topLeft, .topRight])
                        .shadow(color: Color.black.opacity(0.75), radius: 4, y: 2)
                    Button(action: {}) { Image(systemName: "minus.magnifyingglass") }
                        .modifier(MapButtonStyle())
                        .cornerRadius(5, antialiased: true, corners: [.bottomLeft, .bottomRight])
                        .shadow(color: Color.black.opacity(0.75), radius: 4, y: 2)
                }
            }
            .padding()
            .frame(maxHeight: .infinity)
            
            Spacer()
        }
        .frame(maxHeight: .infinity)
    }
}
