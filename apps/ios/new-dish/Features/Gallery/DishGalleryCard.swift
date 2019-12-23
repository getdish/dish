import SwiftUI

struct DishGalleryCard: View {
    var name: String? = nil
    var active = false
    var landmark: DishItem

    var body: some View {
        VStack {
            self.landmark.image
                .resizable()
                .aspectRatio(2 / 2.5, contentMode: .fit)
                .overlay(
                    VStack {
                        TopFadeArea {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(self.name ?? self.landmark.name)
                                        .font(.system(size: 26))
                                        .bold()
                                    Spacer().frame(height: 6)
//                                    Text(self.landmark.park)
                                }
                                Spacer()
                            }
                        }
                        
                        Spacer()
                        
                        BottomFadeArea {
                            Text(self.landmark.name)
                                .font(.system(size: 16))
                        }
                    }
                    .foregroundColor(.white)
                )
                .cornerRadius(20)
                .shadow(
                    color: Color.black.opacity(0.4), radius: 10, x: 0, y: 0
            )
        }
    }
}

class Gradients {
    static let gradientUp = LinearGradient(
        gradient: Gradient(
            colors: [Color.black.opacity(0), Color.black.opacity(0.6)]
        ),
        startPoint: .bottom,
        endPoint: .center
    )

    static let gradientDown = LinearGradient(
        gradient: Gradient(
            colors: [Color.black.opacity(0.6), Color.black.opacity(0)]
        ),
        startPoint: .bottom,
        endPoint: .center
    )
}

struct TopFadeArea<Content>: View where Content: View {
    let content: Content
    
    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        ZStack(alignment: .top) {
            Rectangle().fill(Gradients.gradientUp)
            self.content.padding()
        }
    }
}

struct BottomFadeArea<Content>: View where Content: View {
    let content: Content
    
    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content()
    }

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            Rectangle().fill(Gradients.gradientDown)
            self.content.padding()
        }
    }
}

#if DEBUG
struct DishGalleryCard_Previews: PreviewProvider {
    static var previews: some View {
        DishGalleryCard(landmark: features[0])
            .embedInGeometryReader()
    }
}
#endif


