import SwiftUI
import Combine

struct DishCamera: View {
    @State var isCaptured = true
    @State var isOpen = false
    var cancel: AnyCancellable?
    
    var body: some View {
        return ZStack {
            VStack {
                CameraView(
                    isCaptured: self.$isCaptured
                )
            }
            .background(Color.orange)
            .frame(minWidth: Screen.width, maxHeight: .infinity)
            
            DishCameraPictureOverlay()
            
//            @Binding var isOpen: Bool
//
//            let snapRatio: CGFloat
//            let maxHeight: CGFloat
//            let minHeight: CGFloat
//            let content: Content
//            let userIndicator: AnyView?
            
            BottomSheetView(
                isOpen: $isOpen,
                maxHeight: Screen.height * 0.7,
                minHeight: -100
            ) {
                DishRestaurantDrawer()
            }
        }
        .clipped()
    }
}

struct DishCameraPictureOverlay: View {
    var body: some View {
        print("Render camera picture overlay")
        return ZStack {
            VStack {
                Spacer()
                
                ZStack {
                    BlurView(style: .extraLight)
                    
                    VStack {
                        HStack(spacing: 10) {
                            Text("🧂")
                                .font(.system(size: 60))
                            
                            Text("🧀")
                                .font(.system(size: 60))
                            
                            Text("🧇")
                                .font(.system(size: 60))
                            
                            Text("🥗")
                                .font(.system(size: 60))
                            
                            Text("🍻")
                                .font(.system(size: 60))
                            
                            Text("🍩")
                                .font(.system(size: 60))
                        }
                        .frame(height: 74)
                        
                        Spacer().frame(height: 90)
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 200)
                    .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 0)
                }
                .frame(height: 200)
                .offset(y: false ? 0 : 200)
                .animation(.spring())
            }
            .frameFlex()
        }
        .frameFlex()
    }
}

struct DishRestaurantDrawer: View {
    @State var searchText = ""
    @State var tags: [SearchInputTag] = []
    
    var body: some View {
        VStack(spacing: 3) {
            VStack(spacing: 3) {
                SearchInput(
                    placeholder: "Choose restaurant...",
                    inputBackgroundColor: Color(.secondarySystemGroupedBackground),
                    scale: 1.25,
                    sizeRadius: 2.0,
                    searchText: self.$searchText,
                    tags: self.$tags
                )
                    .padding(.horizontal)
            }
            
            ScrollView {
                List {
                    HStack {
                        Image("hiddenlake.jpg")
                        Text("Pancho Villa Taqueria")
                    }
                }
            }
            .padding(.horizontal, 6)
        }
    }
}

#if DEBUG
struct DishCamera_Previews: PreviewProvider {
    static var previews: some View {
        DishCamera()
    }
}
#endif
