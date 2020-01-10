import SwiftUI

struct BottomNav: View {
    @EnvironmentObject var store: AppStore
    let hiddenButtonY: CGFloat = 100
    
    var body: some View {
        let isOnGallery = false //store.state.galleryDish != nil
        let filters = ["Quiet", "New", "Trending", "Healthy", "Cute"]
        
        return VStack {
            Spacer()
            
            ZStack {
                // main controls
                
                VStack {
                    Spacer()
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 14) {
                            ForEach(0 ..< filters.count) { index in
                                Button(action: {}) {
                                    HStack {
                                        Text(filters[index])
                                            .foregroundColor(.blue)
                                    }
                                    .padding(.vertical, 4)
                                    .padding(.horizontal, 8)
                                    .background(Color.white)
                                    .cornerRadius(20)
                                    .shadow(color: Color.black.opacity(0.5), radius: 5, x: 0, y: 3)
                                }
                                .offset(y: 11)
                            }
                            
                            // end space for camera button
                            Spacer().frame(width: 90)
                        }
                        .padding(12)
                    }
                    .frame(width: Screen.width - 40, height: 80)
                }
                
                //                HStack {
                //                    DishLoginButton()
                //                    .animation(.spring(response: 0.5))
                //                    .offset(y: isOnGallery ? hiddenButtonY : 0)
                //                    Spacer()
                //                }
                //
                //                HStack {
                //                    Spacer()
                //                    DishFiltersButton()
                //                        .animation(.spring(response: 0.75))
                //                        .offset(y: isOnGallery ? hiddenButtonY : 0)
                //                    Spacer()
                //                }
                
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        
                        Button(action: {
                            homePager.animateTo(2)
                        }) {
                            ZStack {
                                Group {
                                    Image(systemName: "viewfinder")
                                        .resizable()
                                        .scaledToFit()
                                    
                                    Image(systemName: "circle.fill")
                                        .resizable()
                                        .scaledToFit()
                                        .frame(width: 16, height: 16)
                                }
                                .foregroundColor(.white)
                            }
                        }
                        .padding(.all, 13)
                        .background(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.8, green: 0.5, blue: 0.8),
                                    Color(red: 0.8 + 0.1, green: 0.5 + 0.1, blue: 0.8 + 0.1)
                                ]),
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                            .cornerRadius(80)
                            .shadow(color: Color.black.opacity(1), radius: 25, x: 0, y: 6)
                            //                        .overlay(
                            //                            RoundedRectangle(cornerRadius: 80)
                            //                                .stroke(Color(red: 0.8 - 2, green: 0.5 - 2, blue: 0.8 - 2).opacity(0.5), lineWidth: 2)
                            //                    )
                            .frame(width: 58, height: 58)
                            .animation(.spring(response: 0.5))
                            .offset(y: isOnGallery ? hiddenButtonY : 0)
                        
                    }
                }
                
                // camera controls
                
                VStack {
                    Spacer()
                    HStack {
                        //                    DishBackButton()
                        //                        .opacity(0.5)
                        //                        .animation(.spring(response: 0.5))
                        //                        .offset(y: !isOnGallery ? hiddenButtonY : 0)
                        Spacer()
                        BottomNavCircularButton(image: "xmark", size: 50, action: {
                            print("CLOSE THAT SHIT")
                            //                        self.store.send(.closeGallery)
                        })
                            .animation(.spring(response: 0.75))
                            .offset(y: !isOnGallery ? hiddenButtonY : 0)
                        Spacer()
                        //                    DishForwardButton()
                        //                        .animation(.spring(response: 0.5))
                        //                        .offset(y: !isOnGallery ? hiddenButtonY : 0)
                    }
                }
            }
            .padding(.horizontal)
            Spacer().frame(height: 56)
        }
    }
}

struct DishLoginButton: View {
    var body: some View {
        Button(action: {
            homePager.animateTo(0)
        }) {
            HStack {
                //                Image(systemName: "person.fill")
                //                    .resizable()
                //                    .scaledToFit()
                //                    .frame(width: 12, height: 12)
                //                    .foregroundColor(.white)
                //                    .shadow(color: Color.black.opacity(0.75), radius: 16, x: 0, y: 2)
                
                Text("LOGIN")
                    .shadow(color: Color.black.opacity(0.75), radius: 24, x: 0, y: 4)
                    .font(.system(size: 15))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                BlurView(style: .systemMaterialDark)
            )
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color.black.opacity(0.4),
                                                    Color.black.opacity(0.5)]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
            )
                .cornerRadius(80)
                .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
                .overlay(
                    RoundedRectangle(cornerRadius: 80)
                        .stroke(Color.white.opacity(0.5), lineWidth: 1)
            )
        }
    }
}


struct DishFiltersButton: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        let button = (
            VStack {
                Text("FILTER")
                    .shadow(color: Color.black.opacity(0.75), radius: 24, x: 0, y: 4)
                    .font(.system(size: 17))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                BlurView(style: .systemMaterialDark)
            )
                .background(
                    LinearGradient(
                        gradient: Gradient(colors: [Color.black.opacity(0.4),
                                                    Color.black.opacity(0.5)]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
            )
                .cornerRadius(80)
                .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
                .overlay(
                    RoundedRectangle(cornerRadius: 80)
                        .stroke(Color.white.opacity(0.5), lineWidth: 1)
            )
        )
        
        return ZStack {
            if self.store.state.home.view == .home {
                ContextMenuView(menuContent: {
                    List {
                        Text("Item One")
                        Text("Item Two")
                        Text("Item Three")
                    }
                        .frame(height: 150) // todo how to get lists that shrink
                }) {
                    button
                }
            } else {
                button
                    .onTapGesture {
                        homePager.animateTo(1)
                }
            }
        }
    }
}


//            BottomNavButton {
////                HStack(spacing: 14) {
//////                    Group {
//////                        Image(systemName: "dollarsign.circle").resizable().scaledToFit()
//////                        Image(systemName: "tag.fill").resizable().scaledToFit()
//////                        Image(systemName: "car.fill").resizable().scaledToFit()
//////                    }
//////                    .foregroundColor(.white)
//////                    .frame(width: 26, height: 26)
////                }
//            }

typealias ActionFn = (() -> Void)

struct BottomNavCircularButton: View {
    var image: String
    var size: CGFloat = 40
    var action: ActionFn? = nil
    var body: some View {
        BottomNavButton(action: self.action) {
            Image(systemName: self.image)
                .resizable()
                .scaledToFit()
                .foregroundColor(.white)
        }
        .frame(width: size, height: size)
    }
}

struct BottomNavButton<Content>: View where Content: View {
    var action: ActionFn? = nil
    let content: () -> Content
    
    init(action: ActionFn? = nil, @ViewBuilder content: @escaping () -> Content) {
        self.action = action
        self.content = content
    }
    
    var body: some View {
        Button(action: {
            if let cb = self.action {
                cb()
            }
        }) {
            self.content()
        }
        .padding(.all, 16)
        .background(
            BlurView(style: .systemMaterialDark)
        )
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [Color.white.opacity(0.4),
                                                Color.white.opacity(0.5)]),
                    startPoint: .top,
                    endPoint: .bottom
                )
        )
            .cornerRadius(80)
            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
            .overlay(
                RoundedRectangle(cornerRadius: 80)
                    .stroke(Color.white.opacity(0.5), lineWidth: 1)
        )
    }
}
