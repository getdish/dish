import SwiftUI
import CoreLocation

struct TopNavSearch: View {
    @State var search = ""
    @Binding var isEditing: Bool
    @EnvironmentObject var store: AppStore
    
    private var locationSearch: Binding<String> {
        store.binding(for: \.locationSearch, { .setLocationSearch($0) })
    }
    
    func focus() {
        //        searchStore.showResults = true
    }
    
    var body: some View {
        let isOnHome = store.state.homePageView == .home
        
        return ZStack {            
            if store.state.showDrawer || isOnHome {
                VStack {
                    ZStack {
                        // camera controls
                        HStack {
                            Button(action: {
                            }) {
                                VStack {
                                    Text("@ Pancho Villa Taqueria")
                                        .fontWeight(.bold)
                                }
                                .padding(.vertical, 4)
                                .padding(.horizontal, 8)
                                .background(Color.white.opacity(0.2))
                                .cornerRadius(20)
                                .onTapGesture {
                                    //                                    Store.camera.showRestaurantDrawer.toggle()
                                }
                            }
                            .foregroundColor(.white)
                            .offset(y: isOnHome ? -80 : 0)
                            .animation(
                                Animation.spring().delay(!isOnHome ? 0.25 : 0.0)
                            )
                            
                            Spacer()
                        }
                        
                        // home controls
                        HStack {
                            Button(action: {
                            }) {
                                VStack {
                                    Text("San Francisco")
                                        .fontWeight(.bold)
                                        .shadow(color: Color.black.opacity(0.35), radius: 2, x: 0, y: 1)
                                }
                                .padding(.vertical, 4)
                                .padding(.horizontal, 8)
                                .background(Color.white.opacity(0.2))
                                .background(Color.black.opacity(0.2))
                                .background(
                                    BlurView(style: .light)
                                )
                                .cornerRadius(20)
                                .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
                            }
                            .foregroundColor(.white)
                            .offset(y: isOnHome ? 0 : -80)
                            .animation(Animation.spring().delay(isOnHome ? 0 : 0.25))
                            
                            Button(action: {
                            }) {
                                VStack {
                                    Text("~10 miles")
                                        .font(.system(size: 14))
                                        .shadow(color: Color.black.opacity(0.35), radius: 2, x: 0, y: 1)
                                }
                                .padding(.vertical, 4)
                                .padding(.horizontal, 8)
                                .background(Color.white.opacity(0.2))
                                .background(Color.black.opacity(0.2))
                                .background(
                                    BlurView(style: .light)
                                )
                                .cornerRadius(20)
                                .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
                            }
                            .foregroundColor(.white)
                            .offset(y: isOnHome ? 0 : -80)
                            .animation(Animation.spring().delay(isOnHome ? 0.2 : 0.4))
                            
                            Spacer()
                        }
                    }
                    .frameFlex()
                }
                .frame(maxWidth: .infinity)
                .environment(\.colorScheme, .dark)
            } else {
                SearchInput(
                    placeholder: "Current Location",
                    inputBackgroundColor: Color(.secondarySystemGroupedBackground).opacity(self.isEditing ? 1.0 : 0.5),
                    icon: store.state.lastKnownLocation != nil ? "location.fill" : "location",
                    showCancelInside: true,
                    onEditingChanged: { isEditing in
                        withAnimation(.spring()) {
                            self.isEditing = isEditing
                        }
                },
                    onCancel: {
//                        Store.mapSearch.showResults = false
                },
                    searchText: self.$search
                )
                    .shadow(color: Color.black.opacity(0.25), radius: 5, x: 0, y: 5)
                    .onTapGesture {
                        self.focus()
                }
            }
        }
    }
}
