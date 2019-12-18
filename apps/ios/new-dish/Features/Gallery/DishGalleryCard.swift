import SwiftUI

struct DishGalleryCard: View {
    var name: String? = nil
    var active = false
    var landmark: Landmark

    var body: some View {
        VStack {
            self.landmark.image
                .resizable()
                .aspectRatio(2 / 2.5, contentMode: .fit)
                .overlay(
                    VStack {
                        TopFadeArea {
                            Text(self.name ?? self.landmark.name)
                                .font(.system(size: 28))
                                .bold()
                            Spacer().frame(height: 6)
                            Text(self.landmark.park)
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

struct TopFadeArea<Content>: View where Content: View {
    let content: Content
    
    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content()
    }
    
    var gradientUp: LinearGradient {
        LinearGradient(
            gradient: Gradient(
                colors: [Color.black.opacity(0), Color.black.opacity(0.6)]
            ),
            startPoint: .bottom,
            endPoint: .center)
    }
    
    var body: some View {
        ZStack(alignment: .top) {
            Rectangle().fill(self.gradientUp)
            VStack {
                Spacer().frame(height: 10)
                self.content
            }
            .padding()
        }
    }
}

struct BottomFadeArea<Content>: View where Content: View {
    let content: Content
    
    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content()
    }
    
    var gradientDown: LinearGradient {
        LinearGradient(
            gradient: Gradient(
                colors: [Color.black.opacity(0.6), Color.black.opacity(0)]
            ),
            startPoint: .bottom,
            endPoint: .center)
    }
    
    var body: some View {
        ZStack(alignment: .bottomLeading) {
            Rectangle().fill(self.gradientDown)
            VStack {
                Spacer().frame(height: 10)
                self.content
            }
            .padding()
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


