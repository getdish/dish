import SwiftUI
import CoreLocation

fileprivate let bottomPad = CGFloat(5)
fileprivate let topPad = Screen.statusBarHeight
fileprivate let totalHeight = topPad + bottomPad + 40

struct TopNavView: View {
    @EnvironmentObject var store: AppStore
    @ObservedObject var homeState = homeViewState

    var body: some View {
        TopNavViewContent()
            .allowsHitTesting(!store.state.disableTopNav)
            .animation(.spring())
            .offset(y: self.homeState.isNearTop ? -100 : 0)
    }
}

struct TopNavViewContent: View {
    var body: some View {
        ZStack {
            VStack {
                Rectangle()
                    .fill(
                        LinearGradient(
                            gradient: Gradient(
                                colors: [Color.black.opacity(0), Color.black.opacity(0.25)]
                            ),
                            startPoint: .bottom,
                            endPoint: .top
                        )
                )
                    .frame(height: Screen.statusBarHeight + 15)
                Spacer()
            }
            .allowsHitTesting(false)
            .disabled(true)
            
            ZStack {
                TopNavSearchResults()
                
                VStack {
                    VStack {
                        HStack(spacing: 12) {
                            ZStack {
                                TopNavHome()
                                CameraTopNav()
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
            .padding(.top, 0)
        }
    }
}

struct TopNavButtonStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .frame(height: 20)
            .padding(.vertical, 4)
            .padding(.horizontal, 8)
            .background(Color.white.opacity(0.075))
            .background(Color.black.opacity(0.075))
            .background(
                BlurView(style: .light)
        )
            .cornerRadius(20)
            .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
            .foregroundColor(.white)
    }
}

struct TopNavHome: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        let homeView = store.state.home.view
        let isOnHome = homeView == .home
        
        return ZStack {
            VStack {
                ZStack {
                    // home controls
                    HStack {
                        if self.store.state.map.locationLabel != "" {
                            Button(action: {
                                App.store.send(.map(.moveToLocation(.init(.current))))
                            }) {
                                VStack {
                                    Text(self.store.state.map.locationLabel)
                                        .titleBarStyle()
                                }
                                .modifier(TopNavButtonStyle())
                            }
                            .offset(y: isOnHome ? 0 : -80)
                            .animation(Animation.spring().delay(isOnHome ? 0 : 0.25))
                            .transition(.opacity)
                        }
                        
                        HStack(spacing: 0) {
                            Button(action: {
                            }) {
                                Text("-")
                                    .titleBarStyle(15)
                                    .padding(.horizontal, 10)
                            }
                            Rectangle()
                                .foregroundColor(.gray)
                                .opacity(0.2)
                                .frame(width: 1)
                            Button(action: {
                            }) {
                                Text("+")
                                    .titleBarStyle(15)
                                    .padding(.horizontal, 10)
                            }
                        }
                        .modifier(TopNavButtonStyle())
                        .offset(y: isOnHome ? 0 : -80)
                        .transition(.slide)
                        
                        
                        
                        Spacer()
                        
//                        Button(action: {
//                            App.enterRepl = true
//                        }) {
//                            VStack {
//                                Text("~\(Int(App.store.state.map.location.radius / 1000)) mi")
//                                    .titleBarStyle()
//                            }
//
//                        }
//                        .modifier(TopNavButtonStyle())
//                        .offset(y: isOnHome ? 0 : -80)
//                        .animation(Animation.spring().delay(isOnHome ? 0.2 : 0.4))
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .environment(\.colorScheme, .dark)
        }
    }
}

struct TopNavSearch: View {
    @EnvironmentObject var store: AppStore
    @Binding var isEditing: Bool
    @State var search = ""
    @State var tags: [SearchInputTag] = []
    
    private var locationSearch: Binding<String> {
        store.binding(for: \.map.search, { .map(.setSearch($0)) })
    }
    
    func focus() {
        //        searchStore.showResults = true
    }
    
    var body: some View {
        SearchInput(
            placeholder: "Current Location",
            inputBackgroundColor: Color(.secondarySystemGroupedBackground).opacity(self.isEditing ? 1.0 : 0.5),
            icon: AnyView(Image(systemName: store.state.map.lastKnown != nil ? "location.fill" : "location")),
            showCancelInside: true,
            onEditingChanged: { isEditing in
                withAnimation(.spring()) {
                    self.isEditing = isEditing
                }
        },
            onCancel: {
                //                        Store.mapSearch.showResults = false
        },
            searchText: self.$search,
            tags: self.$tags
        )
            .shadow(color: Color.black.opacity(0.25), radius: 5, x: 0, y: 5)
            .onTapGesture {
                self.focus()
        }
    }
}

#if DEBUG
struct TopNav_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            TopNavView()
        }
        .embedInAppEnvironment()
        .background(
            LinearGradient(gradient: Gradient(colors: [.white, .red]), startPoint: .top, endPoint: .bottom)
        )
    }
}
#endif
