import SwiftUI

struct DishGalleryViewContent: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        ZStack {
            VStack(spacing: 4) {
                DishGalleryCards()
            }
        }
        .environment(\.colorScheme, .dark)
    }
}

struct DishGalleryCards: View {
    let cards = features
    @State private var translationX: CGFloat = 0
    @State private var curIndex = 0
    
    var body: some View {
        print("render")
        
        let firstCard = FeatureCard(landmark: features[curIndex]).cornerRadius(24)
        let secondCard = FeatureCard(landmark: features[curIndex + 1]).cornerRadius(24)
        
        return GeometryReader { geometry in
            ZStack {
                firstCard
                
                ZStack {
                    secondCard
                        .shadow(
                            color: Color.black.opacity(0.4), radius: 10, x: 0, y: 0
                    )
//                        .rotation3DEffect(
//                            .degrees(20.0),
//                            axis: (0.0, 1.0, 1.0)
//                    )
                }
                .offset(x: self.translationX)
                .gesture(
                    DragGesture(minimumDistance: 0, coordinateSpace: .global)
                        .onChanged { value in
                            self.translationX = value.translation.width
                        }.onEnded { value in
                        let frameWidth = geometry.size.width
                        let offset = value.translation.width / frameWidth
                        let newIndex = (CGFloat(self.curIndex) - offset)
                        print("now \(newIndex)")
                        if abs(newIndex) > 0.5 {
                            withAnimation(.linear(duration: 0.2)) {
                                self.translationX = frameWidth * 2 * (newIndex > 0 ? -1 : 1)
                            }
                            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(200)) {
                                print("finish animation")
                                self.translationX = 0
                                self.curIndex = self.curIndex + 1
                            }
                        }
                    }
                )
            }
            .padding()
        }
    }
}



struct DishGalleryTopNav: View {
    var body: some View {
        HStack(alignment: .bottom) {
            VStack(alignment: .leading) {
                Spacer()
                ScrollView(.horizontal) {
                    HStack(alignment: .bottom) {
                        CategoryLabel(name: "Pho", size: 28.0)
                        CategoryLabel(name: "Ramen", size: 16.0)
                            .opacity(0.5)
                        CategoryLabel(name: "Noodle Soup", size: 16.0)
                            .opacity(0.5)
                        CategoryLabel(name: "Thai", size: 16.0)
                            .opacity(0.5)
                        Spacer()
                    }
                }
            }
            .padding(.horizontal)
            .padding(.top, 20)
        }
        .frame(height: Screen.height * 0.1)
    }
}

struct CategoryLabel: View {
    var name: String
    var place: String?
    var size = 18.0
    var body: some View {
        VStack(alignment: .trailing) {
            Text(name)
                .font(.system(size: CGFloat(size)))
                .fontWeight(.bold)
                .shadow(color: Color.black.opacity(0.4), radius: 2, x: 1, y: 2)
            Text(place ?? "")
                .shadow(color: Color.black.opacity(0.4), radius: 2, x: 1, y: 2)
        }
        .padding(.horizontal, 14)
    }
}


#if DEBUG
struct DishGalleryViewContent_Previews: PreviewProvider {
    static var previews: some View {
        DishGalleryViewContent()
    }
}
#endif


