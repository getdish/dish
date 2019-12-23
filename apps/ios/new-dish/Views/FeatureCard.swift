import SwiftUI

func getLandmarkId(_ landmark: DishItem) -> String {
    "feature-\(landmark.id)"
}

struct FeatureCard: View, Equatable {
    var landmark: DishItem
    let id: Int
    
    init(landmark: DishItem) {
        self.landmark = landmark
        self.id = self.landmark.id
    }
    
    var body: some View {
        print("render featurecard")
        return VStack {
//            MagicItem(getLandmarkId(landmark), at: at) {
                self.landmark.image
                    .resizable()
                    .aspectRatio(2 / 2.25, contentMode: .fit)
                    .overlay(TextOverlay(name: self.landmark.name))
//            }
        }
    }
}

struct TextOverlay: View {
    var name: String
    
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
                Text(name)
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
