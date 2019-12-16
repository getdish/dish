import SwiftUI

struct EmptyModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
    }
}

struct SearchInput: View {
    var placeholder = "Search"
    var inputBackgroundColor = Color(.secondarySystemBackground)
    var borderColor = Color.clear
    var borderWidth = 1
    var blur = 0
    var scale = CGFloat(1)
    var sizeRadius = CGFloat(1)
    var icon = "magnifyingglass"
    var showCancelInside = false
    var onEditingChanged: ((Bool) -> Void)?
    var onCancel: (() -> Void)?
    var after: AnyView?
    
    @Binding var searchText: String
    @State private var showCancelButton: Bool = false
    
    func handleEditingChanged(isEditing: Bool) {
        self.showCancelButton = isEditing
        if let cb = onEditingChanged {
            cb(isEditing)
        }
    }
    
    var cancelButton: some View {
        Button("Cancel") {
            UIApplication.shared.endEditing(true) // this must be placed before the other commands here
            self.searchText = ""
            self.showCancelButton = false
            if let cb = self.onCancel {
                cb()
            }
        }
        .foregroundColor(Color(.systemBlue))
    }
    
    var body: some View {
        let pad = 8 * (scale + 0.5) * 0.5
        
        return VStack {
            // Search view
            HStack {
                HStack(spacing: 4 * scale) {
                    Image(systemName: icon)
                        .frame(width: 24 * scale, height: 24 * scale)
                    
                    TextField(
                        self.placeholder,
                        text: self.$searchText,
                        onEditingChanged: self.handleEditingChanged,
                        onCommit: {
                            print("onCommit")
                    }
                    )
                        .disableAutocorrection(true)
                        .font(.system(size: 14 * scale))
                        .foregroundColor(.primary)
                    
                    Button(action: {
                        self.searchText = ""
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .opacity(self.searchText == "" ? 0.0 : 1.0)
                            .frame(width: 24 * scale, height: 24 * scale)
                    }
                    
                    if after != nil {
                        after
                            .frame(width: 24 * scale, height: 24 * scale)
                    }
                    
                    if showCancelButton && showCancelInside {
                        cancelButton
                            .scaleEffect(0.9)
                    }
                }
                .padding(EdgeInsets(
                    top: pad,
                    leading: pad,
                    bottom: pad,
                    trailing: pad
                ))
                    .foregroundColor(.secondary)
                    .background(self.inputBackgroundColor)
                    .cornerRadius(10.0 * scale * sizeRadius)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10.0 * scale * sizeRadius)
                            .stroke(borderColor, lineWidth: borderWidth)
                    )
                
                if showCancelButton && !showCancelInside {
                    cancelButton
                }
            }
                .navigationBarHidden(showCancelButton) // .animation(.default) // animation does not work properly
        }
    }
}

extension UIApplication {
    func endEditing(_ force: Bool) {
        self.windows
            .filter{$0.isKeyWindow}
            .first?
            .endEditing(force)
    }
}

#if DEBUG
struct SearchInputPreview: View {
    @State var searchText = ""
    var body: some View {
        VStack {
            SearchInput(searchText: $searchText)
            SearchInput(scale: 1.25, searchText: $searchText)
        }
    }
}
struct SearchInput_Previews: PreviewProvider {
    static var previews: some View {
        SearchInputPreview()
    }
}
#endif
