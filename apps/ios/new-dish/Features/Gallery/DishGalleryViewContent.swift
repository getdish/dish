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
    
    struct CardAnimation {
        enum Target { case cur, prev }
        var x: CGFloat = 0
        var target: Target = .cur
        var animateToX = false
    }
    
    @State private var animation: CardAnimation = CardAnimation(x: 0, target: .cur)
    @State private var curIndex = 0
    
    var body: some View {
        print("render")
        
        let animation = self.animation
        let curCard = FeatureCard(landmark: features[curIndex]).modifier(CardStyle())
        let nextCard = FeatureCard(landmark: features[curIndex + 1]).modifier(CardStyle())
        let prevCard = FeatureCard(landmark: features[max(0, curIndex - 1)]).modifier(CardStyle())
        
        return GeometryReader { geometry in
            ZStack {
                nextCard
                
                ZStack {
                    curCard
                    // if you want rotation effect do inside ZStack here:
                    //                    .rotation3DEffect(
                    //                            .degrees(20.0),
                    //                            axis: (0.0, 1.0, 1.0)
                    //                    )
                }
                .offset(x: animation.target == .cur ? animation.x : 0)
                .animation(animation.target == .cur && animation.animateToX ? .spring(response: 0.3) : nil)
                .gesture(
                    DragGesture(minimumDistance: 0, coordinateSpace: .global)
                        .onChanged { value in
                            let x = value.translation.width
                            if self.curIndex == 0 && x > 0 {
                                print("already at start")
                                return
                            }
                            self.animation = CardAnimation(
                                x: x,
                                target: x > 0 ? .prev : .cur,
                                animateToX: false
                            )
                    }.onEnded { value in
                        let frameWidth = geometry.size.width
                        let offset = value.translation.width / frameWidth
                        print("end \(offset) \(frameWidth)")
                        if abs(offset) > 0.35 {
                            let newIndex = Int((CGFloat(self.curIndex) - offset).rounded())
                            print("newIndex \(newIndex)")
                            if newIndex < 0 {
                                return
                            }
                            
                            if newIndex > self.curIndex {
                                // next card
                                self.animation = CardAnimation(
                                    x: -frameWidth,
                                    target: .cur,
                                    animateToX: true
                                )
                            } else {
                                // prev card
                                self.animation = CardAnimation(
                                    x: frameWidth,
                                    target: .prev,
                                    animateToX: true
                                )
                                
                            }
                            
                            // reset state
                            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(300)) {
                                print("finish animation")
                                self.animation = CardAnimation(
                                    x: 0,
                                    target: .cur,
                                    animateToX: false
                                )
                                self.curIndex = newIndex
                            }
                        } else {
                            print("under threshold reset it")
                            
                            if animation.target == .cur {
                                self.animation = CardAnimation(
                                    x: 0,
                                    target: .cur,
                                    animateToX: true
                                )
                            } else {
                                self.animation = CardAnimation(
                                    x: -frameWidth,
                                    target: .prev,
                                    animateToX: true
                                )
                            }
                        }
                    }
                )
                
                prevCard
                    .animation(animation.target == .prev && animation.animateToX ? .spring(response: 0.3) : nil)
                    .offset(x: -geometry.size.width + (animation.target == .prev ? animation.x : 0))
            }
            .padding()
        }
    }
}


struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .cornerRadius(20)
            .shadow(
                color: Color.black.opacity(0.4), radius: 10, x: 0, y: 0
            )
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


