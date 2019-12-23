import SwiftUI

// TODO
fileprivate let cardHeight: CGFloat = 580

struct DishGalleryViewContent: View {    
    var body: some View {
        ZStack {
            ZStack {
                VStack(alignment: .leading) {
                    //                Spacer()
                    
                    DishGalleryCardStack(
                        name: "Pho",
                        items: features
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
        }
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


