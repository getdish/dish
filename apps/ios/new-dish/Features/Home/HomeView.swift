//
//  HomeView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct HomeView: View {
    @State private var isBottomSheetShown = true

    var body: some View {
        GeometryReader { geometry in
            MapView()
            BottomSheetView(
                isOpen: self.$isBottomSheetShown,
                maxHeight: 0.75 * geometry.size.height
            ) {
                Rectangle().fill(Color.red)
            }
        }
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
