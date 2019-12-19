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

struct VerticalCardPager<Content: View>: View {
    @Binding var currentIndex: Int
    let pageCount: Int
    let content: Content
    let height: CGFloat = cardHeight
    
    init(
        pageCount: Int,
        currentIndex: Binding<Int>,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.pageCount = pageCount
        self._currentIndex = currentIndex
        self.content = content()
    }
    
    @GestureState private var translation: CGFloat = 0
    
    enum Lock { case on, off, none }
    @State var lockedTo: Lock = .none
    
    var body: some View {
        GeometryReader { geometry in
            VStack(alignment: .leading, spacing: 0) {
                self.content
            }
            .frame(height: geometry.size.height, alignment: .leading)
            .background(Color.black.opacity(0.0001))
            .offset(y: -CGFloat(self.currentIndex) * self.height)
            .offset(y: self.translation)
            .animation(.spring(response: 0.4))
            .simultaneousGesture(
                DragGesture(minimumDistance: 10.0).updating(self.$translation) { value, state, _ in
                    let x = value.translation.width
                    let y = value.translation.height
                    
                    DispatchQueue.main.async {
                        if self.lockedTo == .none {
                            if abs(x) < 10 && abs(y) > 10 {
                                self.lockedTo = .on
                            }
                            if abs(x) > 10 && abs(y) < 10 {
                                self.lockedTo = .off
                            }
                        }
                    }
                    
                    if self.lockedTo == .off {
                        state = 0
                    } else {
                        state = value.translation.height
                    }
                }.onEnded { value in
                    let offset = value.translation.height / self.height
                    let newIndex = (CGFloat(self.currentIndex) - offset).rounded()
                    self.currentIndex = min(max(Int(newIndex), 0), self.pageCount - 1)
                    DispatchQueue.main.async {
                        self.lockedTo = .none
                    }
                }
            )
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
        print("render")
        
        let animation = self.animation
        let curCard = DishGalleryCard(name: "Miss Saigon", active: true, landmark: items[index])
        let nextCard = DishGalleryCard(name: "Pho 2000", landmark: items[index + 1])
        let prevCard = DishGalleryCard(landmark: items[max(0, index - 1)])
        
        return ZStack {
            nextCard
                .animation(.spring())
                .rotationEffect(.degrees(2.5))
            
            GeometryReader { cardGeometry in
                ZStack {
                    curCard
                        .rotationEffect(.degrees(animation.rotateY))
                        .animation(.linear(duration: 0.1))
                }
                .offset(
                    x: animation.target == .cur ? animation.x : CGFloat(0),
                    y: animation.y
                )
                    .animation(animation.target == .cur && animation.status == .animating ? .spring(response: 0.3) : nil)
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
                                    if grabYPct > 0.5 {
                                        rotateY = Double((grabYPct - 0.5) * 8)
                                    } else {
                                        rotateY = Double(-(0.5 - grabYPct) * 8)
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
                            
                            print("score \(score) -- \(offset) \(offsetEnd)")
                            
                            if score > 0.2 {
                                let newIndex = self.index + (offset > 0 ? -1 : 1)
                                print("newIndex \(newIndex)")
                                if newIndex < 0 {
                                    return
                                }
                                
                                let y = value.predictedEndTranslation.height
                                
                                if newIndex > self.index {
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
                                        y: y,
                                        target: .prev,
                                        status: .animating
                                    )
                                    
                                }
                                
                                // reset state
                                DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(300)) {
                                    print("finish animation")
                                    self.animation = CardAnimation(
                                        x: 0,
                                        y: 0,
                                        target: .cur,
                                        status: .idle
                                    )
                                    self.index = newIndex
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
                    })
            }
            
            prevCard
                .animation(animation.target == .prev && animation.status == .animating
                    ? .spring(response: 0.3)
                    : nil
            )
                .offset(
                    x: -geometry.size.width + (animation.target == .prev ? animation.x : 0),
                    y: animation.target == .prev ? animation.y : CGFloat(0)
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


