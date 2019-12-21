import SwiftUI

struct HomeMapControls: View {
    var body: some View {
        VStack {
            HStack {
                Spacer()
                VStack(spacing: 0) {
                    Button(action: {}) { Image(systemName: "plus.magnifyingglass") }
                        .buttonStyle(MapButtonStyle())
                        .cornerRadius(5, antialiased: true, corners: [.topLeft, .topRight])
                        .shadow(color: Color.black.opacity(0.25), radius: 4, y: 2)
                    Button(action: {}) { Image(systemName: "minus.magnifyingglass") }
                        .buttonStyle(MapButtonStyle())
                        .cornerRadius(5, antialiased: true, corners: [.bottomLeft, .bottomRight])
                        .shadow(color: Color.black.opacity(0.25), radius: 4, y: 2)
                }
            }
            .padding()
        }
    }
}

struct MapButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.vertical, 12)
            .padding(.horizontal, 4)
            .background(Color(.tertiarySystemBackground))
    }
}
