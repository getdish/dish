import SwiftUI

struct DishGalleryCard: View {
    var disabled = false
    var landmark: Landmark
    var body: some View {
        VStack {
            FeatureCard(landmark: landmark)
                .overlay(
                    disabled ? Rectangle().foregroundColor(Color.black.opacity(0.5)).cornerRadius(14) : nil
            )
        }
        .padding(.horizontal, 4)
    }
}
