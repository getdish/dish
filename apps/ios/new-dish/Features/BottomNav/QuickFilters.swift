import SwiftUI

struct QuickFilters: View {
    let filters = ["Quiet", "New", "Trending", "Healthy", "Cute"]
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 14) {
                ForEach(0 ..< filters.count) { index in
                    Button(action: {}) {
                        HStack {
                            Text(self.filters[index])
                                .font(.system(size: 15))
                                .fontWeight(.medium)
                                .foregroundColor(.blue)
                        }
                        .padding(.vertical, 6)
                        .padding(.horizontal, 9)
                        .background(Color.white)
                        .cornerRadius(20)
                        .shadow(color: Color.black.opacity(0.5), radius: 5, x: 0, y: 3)
                    }
                }
                
                // end space for camera button
                Spacer().frame(width: 90)
            }
            .padding(12)
            .offset(y: 11)
        }
        .frame(width: Screen.width - 40, height: 80)
        .mask(
            LinearGradient(
                gradient: .init(colors: [
                    Color.white.opacity(0),
                    Color.black,
                    Color.black,
                    Color.black,
                    Color.black,
                    Color.black,
                    Color.black,
                    Color.black,
                    Color.black
                ]),
                startPoint: .trailing,
                endPoint: .leading
            )
        )
    }
}
