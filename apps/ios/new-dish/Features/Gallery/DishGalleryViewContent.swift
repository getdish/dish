import SwiftUI

// TODO
fileprivate let cardHeight: CGFloat = 580

struct DishGalleryViewContent: View {
    @EnvironmentObject var store: AppStore
    @State var curCuisineIndex = 0
    @State var curRestaurantIndex = 0
    @State var curRestaurantIndex2 = 0
    
    var body: some View {
        ZStack {
            ZStack {
                VStack(alignment: .leading) {
                    //                Spacer()
                    
                    DishGalleryCardStack(
                        name: "Pho",
                        items: features,
                        index: self.$curRestaurantIndex
                    )
                    
                    //                Horizontal card row below
                    //                ScrollView(.horizontal, showsIndicators: false) {
                    //                    HStack {
                    //                        ForEach(0..<10) { i in
                    //                            DishBrowseCard(landmark: features[i])
                    //                                .frame(width: 140)
                    //                        }
                    //                    }
                    //                    .padding()
                    //                }
                    
                    
                    //                Vertical cards
                    //                VerticalCardPager(
                    //                    pageCount: 2,
                    //                    currentIndex: self.$curCuisineIndex
                    //                ) {
                    //                    Spacer()
                    //                        .frame(height: 580)
                    //
                    //
                    //
                    //                    DishGalleryDish(
                    //                        name: "Ramen",
                    //                        items: features,
                    //                        index: self.$curRestaurantIndex2
                    //                    )
                    //                }
                }
                
                //                pill style title
                //                VStack {
                //                    HStack {
                //                        Spacer()
                //                        Button(action: {
                //                            //            action()
                //                        }) {
                //                            Text("Noodles")
                //                                .fontWeight(.semibold)
                //                                .font(.system(size: 18))
                //                                .foregroundColor(.white)
                //                        }
                //                        .padding(.vertical, 12)
                //                        .padding(.horizontal, 16)
                //                        .overlay(
                //                            RoundedRectangle(cornerRadius: 80)
                //                                .stroke(Color.white.opacity(0.5), lineWidth: 1)
                //                        )
                //                            .cornerRadius(80)
                //                            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
                //                        Spacer()
                //                    }
                //                    .padding(.top, 110 + Screen.statusBarHeight)
                //                    .padding(.bottom, 20)
                //                    Spacer()
                //                }
            }
            //            .clipShape(clipPath)
            //            .edgesIgnoringSafeArea(.all)
            //            .environment(\.colorScheme, .dark)
            
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    BottomNavButton {
                        Image(systemName: "chevron.right.circle")
                            .resizable()
                            .foregroundColor(.white)
                    }
                    .onTapGesture {
                        print("update it...")
                        self.curRestaurantIndex += 1
                    }
                    .frame(width: 54, height: 54)
                }
                Spacer()
                BottomNavButton {
                    Image(systemName: "star")
                        .resizable()
                        .foregroundColor(.white)
                }
                .frame(width: 45, height: 45)
            }
            .frame(height: 505)
        }
    }
}

struct DishGalleryCardStack: View {
    var name: String
    var items: [Landmark]
    var index: Binding<Int>
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Tag {
                    Text(self.name)
                        .font(.system(size: 26))
                        .bold()
                        .shadow(color: Color.black.opacity(0.4), radius: 2, x: 1, y: 2)
                        .padding(.vertical, 4)
                        .padding(.horizontal, 4)
                }
                
                Spacer()
            }
            .padding(.horizontal, 30)
            .padding(.bottom, 10)
            
            DishGalleryCardStackCards(
                items: items,
                index: self.index
            )
        }
    }
}

struct DishGalleryCardStackCards: View {
    @Environment(\.geometry) var appGeometry
    private var geometry: GeometryProxy { appGeometry! }
    
    var items: [Landmark]
    @Binding var index: Int
    
    struct CardAnimation {
        enum Target { case cur, prev }
        enum Status { case dragging, animating, idle }
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rotateY: Double = 0
        var target: Target = .cur
        var status: Status = .idle
    }
    
    @State private var animation: CardAnimation = CardAnimation(x: 0, target: .cur)
    
    var width: CGFloat = 0
    
    var isDragging: Bool {
        return self.animation.x != 0 || self.animation.y != 0
    }
    
    var body: some View {
        let animation = self.animation
        let isIdle = animation.status == .idle
        let curCard = DishGalleryCard(name: "Miss Saigon", active: true, landmark: items[index])
        let nextCard = DishGalleryCard(name: "Pho 2000", landmark: items[index + 1])
        let prevCard = DishGalleryCard(landmark: items[max(0, index - 1)])
        
        print("render2 .. \(animation.status) to (\(animation.x), \(animation.y))")
        
        return ZStack {
            nextCard
                .rotationEffect(.degrees(animation.status == .idle ? 2.5 : 0.0))
                .animation(.spring())
            
            GeometryReader { cardGeometry in
                ZStack {
                    curCard
                        .rotationEffect(.degrees(animation.rotateY))
                        .animation(isIdle ? nil : .linear(duration: 0.1))
                }
                .offset(
                    x: animation.target == .cur ? animation.x : 0,
                    y: animation.y
                )
                    .animation(animation.target == .cur && !isIdle
                        ? .spring(response: 0.3)
                        : nil
                )
                    .simultaneousGesture(
                        DragGesture()
                            .onChanged { value in
                                let x = value.translation.width
                                let y = value.translation.height
                                let isDragging = self.animation.status == .dragging
                                let isStartingDrag = !isDragging
                                
                                // if at beginning
                                if self.index == 0 && x > 0 {
                                    if x > 20 {
                                        // do a little shake or something
                                    }
                                    if !isDragging {
                                        return
                                    }
                                }
                                
                                var rotateY: Double = self.animation.rotateY
                                
                                // on start drag, rotate it based on where they grabbed at
                                if isStartingDrag {
                                    let cardFrameHeight = cardGeometry.size.height
                                    let grabbedYAt = value.location.y
                                    let grabYPct = grabbedYAt / cardFrameHeight
                                    let maxRotationDeg = 10.0
                                    if grabYPct > 0.5 {
                                        rotateY = Double((grabYPct - 0.5) * maxRotationDeg)
                                    } else {
                                        rotateY = Double(-(0.5 - grabYPct) * maxRotationDeg)
                                    }
                                }
                                
                                self.animation = CardAnimation(
                                    x: x,
                                    y: y,
                                    rotateY: rotateY,
                                    // only change target on start of drag
                                    target: isStartingDrag
                                        ? (x > 0 ? .prev : .cur)
                                        : self.animation.target,
                                    status: .dragging
                                )
                        }.onEnded { value in
                            let frameWidth = self.geometry.size.width
                            let offset = value.translation.width / frameWidth
                            let offsetEnd = value.predictedEndTranslation.width / frameWidth
                            
                            // we can tune this score now based on various factors
                            // for now just average the offset + offsetEnd
                            let score = abs((offset + offsetEnd) / 2)
                            let shouldChange = score > 0.2
                            let newIndex = shouldChange
                                ? self.index + (offset > 0 ? -1 : 1)
                                : self.index
                            
                            print("score \(score) -- \(offset) \(offsetEnd)")
                            
                            if shouldChange {
                                print("newIndex \(newIndex), curIndex \(self.index)")
                                if newIndex < 0 {
                                    return
                                }
                                
                                let y = value.predictedEndTranslation.height
                                
                                if newIndex > self.index {
                                    print("next card x \(-frameWidth) y \(y)")
                                    // next card
                                    self.animation = CardAnimation(
                                        x: -frameWidth,
                                        y: y,
                                        target: .cur,
                                        status: .animating
                                    )
                                } else {
                                    // prev card
                                    self.animation = CardAnimation(
                                        x: frameWidth,
                                        y: 0,
                                        target: .prev,
                                        status: .animating
                                    )
                                    
                                }
                            } else {
                                print("under threshold reset it")
                                if self.animation.target == .cur {
                                    self.animation = CardAnimation(
                                        x: 0,
                                        y: 0,
                                        target: .cur,
                                        status: .animating
                                    )
                                } else {
                                    self.animation = CardAnimation(
                                        x: -frameWidth,
                                        y: 0,
                                        target: .prev,
                                        status: .animating
                                    )
                                }
                            }
                            
                            // reset state
                            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(500)) {
                                print("finish animation")
                                self.animation = CardAnimation(
                                    x: 0,
                                    y: 0,
                                    target: .cur,
                                    status: .idle
                                )
                                self.index = newIndex
                            }
                    })
            }
            
            prevCard
                .animation(animation.target == .prev && !isIdle
                    ? .spring(response: 0.3)
                    : nil
            )
                .offset(
                    x: -geometry.size.width + (animation.target == .prev && !isIdle ? animation.x : 0),
                    y: animation.target == .prev ? animation.y : 0
            )
        }
            // for now hardcoded
            .frame(height: 500)
            .padding(.horizontal, 12)
            .padding(.bottom, 25)
            .padding(.top, 6)
    }
}

struct Cutout {
    let cardFrame = CGRect(
        x: 0, y: 0, width: Screen.width + 10, height: Screen.height
    )
    var clipPath = Path()
    init() {
        clipPath.cardControlsCutout(rect: cardFrame, circleSize: 68)
    }
}
let clipPath = Cutout().clipPath


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
        ZStack {
            Color.black
            DishGalleryViewContent()
        }
        .embedInAppEnvironment(Mocks.galleryVisibleDish)
    }
}
#endif


