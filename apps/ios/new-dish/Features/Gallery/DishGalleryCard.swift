import SwiftUI

struct DishGalleryCard: View {
    var active = false
    var landmark: Landmark
    var body: some View {
        VStack {
            self.landmark.image
                .resizable()
                .aspectRatio(2 / 2.5, contentMode: .fit)
                .overlay(DishGalleryCardInfo(landmark: self.landmark))
                .cornerRadius(20)
                .shadow(
                    color: Color.black.opacity(0.4), radius: 10, x: 0, y: 0
            )
        }
    }
}

struct DishGalleryCardInfo: View {
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
                // add some padding above for gradient
                Spacer().frame(height: 20)
                
                Text(landmark.name)
                    .font(.system(size: 20))
                    .bold()
                
                Spacer().frame(height: 6)

                Text(landmark.park)
            }
            .padding()
        }
        .foregroundColor(.white)
    }
}
