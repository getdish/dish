import SwiftUI

struct DishGalleryViewContent: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        ZStack {
            BlurView(style: .systemUltraThinMaterial)
                .frameFlex()
            
            VStack(spacing: 4) {
                Spacer()
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
                    .frameFlex()
                }
                .frameFlex()
                .frame(height: Screen.height * 0.3)
                
                ScrollView {
                    VStack(spacing: 0) {
                        DishGalleryCard(landmark: features[0])
                        DishGalleryCard(landmark: features[1])
                        DishGalleryCard(landmark: features[2])
                        DishGalleryCard(landmark: features[3])
                    }
                }
            }
        }
        .environment(\.colorScheme, .dark)
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
