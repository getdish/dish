import SwiftUI
import CoreLocation

struct TopNavSearch: View {
    @EnvironmentObject var store: AppStore
    
    var body: some View {
        let homeView = store.state.home.view
        let isOnHome = homeView == .home
        
        return ZStack {
            VStack {
                ZStack {
                    
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
                        
                        Spacer()
                        
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
                    }
                }
                .frameFlex()
            }
            .frame(maxWidth: .infinity)
            .environment(\.colorScheme, .dark)
        }
    }
}

struct TopNavSearchBar: View {
    @EnvironmentObject var store: AppStore
    @Binding var isEditing: Bool
    @State var search = ""
    @State var tags: [SearchInputTag] = []
    
    private var locationSearch: Binding<String> {
        store.binding(for: \.location.search, { .location(.setSearch($0)) })
    }
    
    func focus() {
        //        searchStore.showResults = true
    }

    var body: some View {
        SearchInput(
            placeholder: "Current Location",
            inputBackgroundColor: Color(.secondarySystemGroupedBackground).opacity(self.isEditing ? 1.0 : 0.5),
            icon: AnyView(Image(systemName: store.state.location.lastKnown != nil ? "location.fill" : "location")),
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
