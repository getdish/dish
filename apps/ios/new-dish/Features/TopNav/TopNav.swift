import SwiftUI
import CoreLocation

fileprivate let bottomPad = CGFloat(5)
fileprivate let topPad = Screen.statusBarHeight
fileprivate let totalHeight = topPad + bottomPad + 40

struct TopNav: View {    
    var body: some View {
        ZStack {
            VStack {
                Rectangle()
                    .fill(
                        LinearGradient(
                            gradient: Gradient(
                                colors: [Color.black.opacity(0), Color.black.opacity(0.65)]
                            ),
                            startPoint: .bottom,
                            endPoint: .top
                        )
                )
                    .frame(height: 140)
                Spacer()
            }
            
            ZStack {
                TopNavSearchResults()
                
                VStack {
                    VStack {
                        HStack(spacing: 12) {
                            ZStack {
                                TopNavSearch()
                                CameraTopNav()
                            }

//                            if !isEditing {
                                TopNavMenuButton()
//                            }
                        }
                        .padding(.horizontal)
                    }
                    .padding(.top, topPad)
                    .padding(.bottom, bottomPad)
                    .frame(maxHeight: totalHeight, alignment: Alignment.top)
                    
                    Spacer()
                }
            }
                // how do i pad == safe area
                .padding(.top, 40)
        }
    }
}

#if DEBUG
struct TopNav_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            TopNav()
        }
        .embedInAppEnvironment()
        .background(
            LinearGradient(gradient: Gradient(colors: [.white, .red]), startPoint: .top, endPoint: .bottom)
        )
    }
}
#endif
