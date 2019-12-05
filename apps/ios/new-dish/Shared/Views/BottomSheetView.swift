//
//  BottomSheetView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

fileprivate enum Constants {
    static let radius: CGFloat = 16
    static let indicatorHeight: CGFloat = 6
    static let indicatorWidth: CGFloat = 60
    static let snapRatio: CGFloat = 0.25
    static let minHeightRatio: CGFloat = 0.3
}

fileprivate enum DragState {
    case open
    case closed
    case dragging(position: CGFloat)
}

struct BottomSheetView<Content: View>: View {
    @Binding var isOpen: Bool

    let maxHeight: CGFloat
    let minHeight: CGFloat
    let content: Content

    @State private var dragState: DragState = .closed

    private var offsetY: CGFloat {
        switch dragState {
        case .open: return 0
        case .closed: return maxHeight - minHeight
        case let .dragging(position):
            return min(max(position, 0), maxHeight - minHeight)
        }
    }

    private var indicator: some View {
        RoundedRectangle(cornerRadius: Constants.radius)
            .fill(Color.secondary)
            .frame(
                width: Constants.indicatorWidth,
                height: Constants.indicatorHeight
        )
    }

    private var dragGesture: some Gesture {
        DragGesture().onChanged { value in
            let position = value.startLocation.y + value.translation.height
            self.dragState = .dragging(position: position)
        }.onEnded { value in
            let snapDistance = self.maxHeight * Constants.snapRatio
            self.isOpen = value.translation.height < snapDistance
            self.dragState = self.isOpen ? .open : .closed
        }
    }

    init(isOpen: Binding<Bool>, maxHeight: CGFloat, @ViewBuilder content: () -> Content) {
        self.minHeight = maxHeight * Constants.minHeightRatio
        self.maxHeight = maxHeight
        self.content = content()
        self._isOpen = isOpen
        self.dragState = isOpen.wrappedValue ? .open : .closed
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            Spacer()
                .layoutPriority(1.0)
            VStack(spacing: 0) {
                self.indicator.padding()
                self.content
            }
            .background(Color(.secondarySystemBackground))
            .frame(height: self.maxHeight)
            .cornerRadius(Constants.radius)
            .offset(y: self.offsetY)
            .gesture(self.dragGesture)
            .animation(.interactiveSpring())
        }
    }
}

struct BottomSheetView_Previews: PreviewProvider {
    static var previews: some View {
        BottomSheetView(isOpen: .constant(false), maxHeight: 600) {
            Rectangle().fill(Color.red)
        }.edgesIgnoringSafeArea(.all)
    }
}
