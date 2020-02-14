import SwiftUI
import Introspect

struct EmptyModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
    }
}

struct SearchInputTag: Identifiable, Equatable {
    var color: Color
    var text: String
    var deletable: Bool = true
    var id: String {
        "\(color.hashValue)\(text)"
    }
}

struct SearchInputTagView: View {
    var tag: SearchInputTag
    var fontSize: CGFloat

    var body: some View {
        HStack(spacing: 8) {
            Text(tag.text)
                .fixedSize()
                .font(.system(size: fontSize))
            
            if tag.deletable {
                VStack {
                    Image(systemName: "xmark")
                        .resizable()
                        .frame(width: 10, height: 10)
                        .padding(3)
                }
                .background(tag.color.brightness(-0.1))
                .cornerRadius(4)
                .opacity(0.5)
            }
        }
        .foregroundColor(Color.white)
        .padding(.horizontal, 6)
        .padding(.vertical, 5)
        .background(tag.color)
        .cornerRadius(4)
    }
}

struct SearchInput: View {
    var placeholder = "Search"
    var inputBackgroundColor = Color(.secondarySystemBackground)
    var borderColor = Color.clear
    var borderWidth = 1.0
    var blur = 0
    var scale: CGFloat = 1
    var sizeRadius = CGFloat(1)
    var icon: AnyView?
    var showCancelInside = false
    var onEditingChanged: ((Bool) -> Void)?
    var onCancel: (() -> Void)?
    var onClear: (() -> Void)?
    var after: AnyView?
    var onTextField: ((UITextField) -> Void)?
    var isFirstResponder: Bool = false
    @Binding var searchText: String
    @Binding var tags: [SearchInputTag]
    var showInput = true
    
    @State private var showCancelButton: Bool = false
    
    @Environment(\.colorScheme) var colorScheme
    
    func handleEditingChanged(isEditing: Bool) {
        self.showCancelButton = isEditing
        if let cb = onEditingChanged {
            cb(isEditing)
        }
    }
    
    var cancelButton: some View {
        Button("Done") {
            UIApplication.shared.endEditing(true) // this must be placed before the other commands here
            self.showCancelButton = false
            if let cb = self.onCancel {
                cb()
            }
        }
        .foregroundColor(Color(.systemBlue))
    }
    
    var body: some View {
        let pad = 8 * (scale + 0.5) * 0.6
        let numTags = self.tags.count
        let hasTags = numTags > 0
        let fontSize = 14 * (scale - 1) / 2 + 14
        
        return VStack {
            // Search view
            HStack {
                HStack(spacing: 4 * scale) {
                    VStack {
                        icon ?? AnyView(
                            Image(systemName: "magnifyingglass")
                                .resizable()
                                .scaledToFit()
                        )
                    }
                    .frame(width: 24 * scale, height: 24 * scale)
                    
                    if hasTags {
                        HStack {
                            ForEach(self.tags) { tag in
                                SearchInputTagView(
                                    tag: tag,
                                    fontSize: fontSize
                                )
                                    .transition(.slide)
                                    .animation(.easeIn(duration: 0.3))
                                    .onTapGesture {
                                        if tag.deletable {
                                            if let index = self.tags.firstIndex(of: tag) {
                                                print("removing tag at \(index)")
                                                self.tags.remove(at: index)
                                            }
                                        }
                                    }
                            }
                        }
                    }
                    
                    // TODO (performance / @majid) - snapToBottom(false) is jittery, if you replace
                    // this next view with Color.red you'll see it goes fast... why?
                    if showInput {
                        CustomTextField(
                            placeholder: hasTags ? "" : self.placeholder,
                            text: self.$searchText,
                            isFirstResponder: self.isFirstResponder,
                            onEditingChanged: self.handleEditingChanged
                        )
                    } else {
                        // temp bugfix for above TODO problem...
                        HStack {
                            Group {
                                if self.searchText != "" {
                                    Text(self.searchText)
                                } else {
                                    Text(self.placeholder).opacity(0.3)
                                }
                            }
                            .font(.system(size: fontSize + 2))
                            Spacer()
                        }
                        .frameFlex()
                    }
                    

//                        .disableAutocorrection(true)
//                        .font(.system(size: fontSize))
//                        .foregroundColor(.primary)

                    Button(action: {
                        self.searchText = ""
                        if let cb = self.onClear {
                            cb()
                        }
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 26 + 2 * scale, height: 24 + 2 * scale)
                            .opacity(self.searchText == "" ? 0.0 : 1.0)
                    }
                    
                    if showCancelButton && showCancelInside {
                        cancelButton
                    }
                    
                    if after != nil {
                        after
                            .frame(height: 24 * scale)
                    }
                }
                    .padding(EdgeInsets(
                        top: pad,
                        leading: pad * 1.3,
                        bottom: pad,
                        trailing: pad * 1.3
                    ))
                    .foregroundColor(.secondary)
                    .background(self.inputBackgroundColor)
                    .cornerRadius(10.0 * scale * sizeRadius)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10.0 * scale * sizeRadius)
                            .stroke(self.borderColor, lineWidth: 1)
                    )
                
                if showCancelButton && !showCancelInside {
                    cancelButton
                }
            }
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
    @State var tags: [SearchInputTag] = []

    var body: some View {
        VStack {
            SearchInput(searchText: $searchText, tags: $tags)
            SearchInput(scale: 1.25, searchText: $searchText, tags: $tags)
        }
    }
}
struct SearchInput_Previews: PreviewProvider {
    static var previews: some View {
        SearchInputPreview()
    }
}
#endif
