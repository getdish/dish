//
//  HomeView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct HomeView: View {
    @State private var index: CGFloat = 1.0

    var body: some View {
        PagerView(
            currentIndex: $index,
            pages: [
                Color.blue,
                Color.red,
                Color.green
            ]
        )
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
