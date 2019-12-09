//
//  PagerView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct PagerView<Page: View>: View {
    @Binding var currentIndex: CGFloat
    let pages: [Page]

    @GestureState private var offset: CGFloat = 0

    var body: some View {
        GeometryReader { geometry in
            HStack(spacing: 0) {
                ForEach(0..<self.pages.count) { index in
                    self.pages[index]
                        .frame(width: geometry.size.width)
                }
            }
            .offset(x: -(self.currentIndex - self.offset) * geometry.size.width)
            .frame(width: geometry.size.width, alignment: .leading)
            .animation(.interactiveSpring())
            .gesture(
                DragGesture().updating(self.$offset) { value, state, _ in
                    state = value.translation.width / geometry.size.width
                }.onEnded { value in
                    let offset = value.translation.width / geometry.size.width
                    let newIndex = (self.currentIndex - offset).rounded()
                    self.currentIndex = min(max(newIndex, 0), CGFloat(self.pages.count - 1))
                }
            )
        }
    }
}

struct PagerView_Previews: PreviewProvider {
    static var previews: some View {
        PagerView(
            currentIndex: .constant(0),
            pages: [
                Color.blue,
                Color.red,
                Color.green
            ]
        )
    }
}
