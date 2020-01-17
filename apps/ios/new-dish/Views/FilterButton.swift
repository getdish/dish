import SwiftUI

struct FilterButton: View {
    @Environment(\.colorScheme) var colorScheme
    var label: String
    var action: () -> Void
    
    var body: some View {
        ZStack {
            Button(action: action) {
                Text(label)
                    .foregroundColor(Color(.systemBackground).opacity(0.85))
                    .font(.system(size: 14))
            }
            .padding(.vertical, 7)
            .padding(.horizontal, 12)
            .background(
                Color(colorScheme == .dark ? .white : .systemFill).opacity(0.9)
            )
                .overlay(
                    RoundedRectangle(cornerRadius: 80)
                        .stroke(Color(.systemFill).opacity(0.25), lineWidth: 2)
            )
                .cornerRadius(80)
                .shadow(color: Color(.systemBackground).opacity(0.5), radius: 7, x: 0, y: 2)
        }
    }
}


struct FilterButtonStrong: View {
    var label: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .foregroundColor(.white)
                .fontWeight(.semibold)
                .font(.system(size: 14))
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(Color.blue.opacity(0.35))
        .overlay(
            RoundedRectangle(cornerRadius: 80)
                .stroke(Color.white, lineWidth: 1)
        )
            .cornerRadius(80)
            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 8)
    }
}


