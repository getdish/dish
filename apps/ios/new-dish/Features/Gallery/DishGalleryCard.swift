import SwiftUI

struct DishGalleryCard: View {
    var name: String? = nil
    var active = false
    var dish: DishItem
    var aspectRatio: CGFloat = 2 / 2.5

    var body: some View {
        VStack {
            self.dish.image
                .resizable()
                .aspectRatio(aspectRatio, contentMode: .fit)
                .overlay(
                    VStack {
                        TopFadeArea {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(self.name ?? self.dish.name)
                                        .font(.system(size: 26))
                                        .bold()
                                    Spacer().frame(height: 6)
//                                    Text(self.dish.park)
                                }
                                Spacer()
                            }
                        }
                        
                        Spacer()
                        
                        BottomFadeArea {
                            Text(self.dish.name)
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
        DishGalleryCard(dish: features[0])
            .embedInGeometryReader()
    }
}
#endif


