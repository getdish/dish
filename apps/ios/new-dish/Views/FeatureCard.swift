import SwiftUI

func getLandmarkId(_ landmark: Landmark) -> String {
    "feature-\(landmark.id)"
}

struct FeatureCard: View, Identifiable {
    var landmark: Landmark
    var at: MagicItemPosition = .start
    var id = UUID()
    
    var body: some View {
        VStack {
            MagicItem(getLandmarkId(landmark), at: at) {
                self.landmark.image
                    .resizable()
                    .aspectRatio(2 / 3, contentMode: .fit)
                    .overlay(TextOverlay(landmark: self.landmark))
            }
        }
    }
}

struct TextOverlay: View {
    var landmark: Landmark
    
    var gradient: LinearGradient {
        LinearGradient(
            gradient: Gradient(
                colors: [Color.black.opacity(0.6), Color.black.opacity(0)]),
            startPoint: .bottom,
            endPoint: .center)
    }
    
    var body: some View {
        ZStack(alignment: .bottomLeading) {
            Rectangle().fill(gradient)
            VStack(alignment: .leading) {
                Text(landmark.name)
                    .font(.system(size: 20))
                    .bold()
                //        Text(landmark.park)
            }
            .padding()
        }
        .foregroundColor(.white)
    }
}

struct FeatureCard_Previews: PreviewProvider {
    static var previews: some View {
        FeatureCard(landmark: features[0])
    }
}
