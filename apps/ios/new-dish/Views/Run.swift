import SwiftUI

struct Run: View {
    let block: () -> Void
    
    var body: some View {
        DispatchQueue.main.async(execute: block)
        return AnyView(EmptyView())
    }
}
