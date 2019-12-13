import SwiftUI
import CoreLocation

fileprivate let bottomPad = CGFloat(5)
fileprivate let topPad = Screen.statusBarHeight
fileprivate let totalHeight = topPad + bottomPad + 40

struct HomeTopBar: View {
    @State var isEditing = false
    
    var body: some View {
        ZStack {
            HomeTopBarSearchResults()
            
            VStack {
                VStack {
                    HStack(spacing: 12) {
                        HomeTopBarSearch(
                            isEditing: self.$isEditing
                        )
                        if !isEditing {
                            HomeTopBarAccountButton()
                        }
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

#if DEBUG
struct HomeTopBar_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            HomeTopBar()
        }
        .background(
            LinearGradient(gradient: Gradient(colors: [.white, .red]), startPoint: .top, endPoint: .bottom)
        )
    }
}
#endif
