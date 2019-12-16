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

fileprivate let firstCard: some View = FeatureCard(landmark: features[0]).cornerRadius(24)
fileprivate let secondCard: some View = FeatureCard(landmark: features[1]).cornerRadius(24)

struct DishGalleryCards: View {
    @GestureState private var translationX: CGFloat = 0
    @State var curIndex = 1
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                firstCard
                
                
                ZStack {
                    secondCard
                    .rotation3DEffect(
                        .degrees(20.0),
                        axis: (0.0, 0.0, 50.0)
                    )
                }
                    .offset(x: self.translationX)
                    .gesture(
                        DragGesture().updating(self.$translationX) { value, state, _ in
                            state = value.translation.width
                        }.onEnded { value in
//                            let offset = value.translation.width / geometry.size.width
//                            let newIndex = (CGFloat(self.currentIndex) - offset).rounded()
//                            print("now \(newIndex)")
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


