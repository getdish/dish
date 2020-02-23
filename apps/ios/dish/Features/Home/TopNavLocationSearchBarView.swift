import SwiftUI

struct TopNavLocationSearchBarView: View {
    @Environment(\.colorScheme) var colorScheme
    @EnvironmentObject var screen: ScreenModel
    @EnvironmentObject var store: AppStore
    @State var textField: UITextField? = nil
    @State private var isFocused: Bool = false
    
    var locationSearch: Binding<String> {
        store.binding(for: \.map.locationLabel, { .map(.setLocationLabel($0)) })
    }
    
    var cancelButton: some View {
        Button("Done") {
            UIApplication.shared.endEditing(true) // this must be placed before the other commands here
            self.isFocused = false
        }
        .foregroundColor(Color(.systemBlue))
    }
    
    var body: some View {
        HStack {
            HStack {
                TextField("",
                          text: self.locationSearch,
                          onEditingChanged: { isEditing in
                            async {
                                self.isFocused = isEditing
                            }
                            if isEditing {
                                App.store.send(.home(.setSearchFocus(.location)))
                            } else {
                                async {
                                    if self.store.state.home.searchFocus == .location {
                                        App.store.send(.home(.setSearchFocus(.off)))
                                    }
                                }
                            }
                            
                            if isEditing {
                                //                    if self.store.state.home.drawerPosition != .top {
                                //                        self.store.send(.home(.setDrawerPosition(.top)))
                                //                    }
                                
                                // select all text
                                if let textField = self.textField {
                                    textField.becomeFirstResponder()
                                    textField.selectAll(nil)
                                }
                            }
                })
                    .introspectTextField { next in
                        self.textField = next
                    }
                
                Spacer()
                
                if isFocused {
                    cancelButton
                        .transition(.slide)
                }
            }
                .font(.system(size: 14))
                .multilineTextAlignment(isFocused ? .leading : .center)
                .padding(.horizontal, 20)
                .modifier(TopNavButtonStyle())
                .overlay(
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 12, height: 12)
                            .foregroundColor(.white)
                            .opacity(0.25)
                        Spacer()
                    }
                    .padding(.leading, 12)
                )
        }
    }
}
