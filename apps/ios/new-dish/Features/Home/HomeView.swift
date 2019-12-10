//
//  HomeView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct HomeView: View {
    @Environment(\.colorScheme) var colorScheme: ColorScheme
    @State private var index = 1

    var body: some View {
        ZStack {
            HomeMap()
            
//            PagerView(
//                currentIndex: $index,
//                pages: [
//                    Color.blue,
//                    Color.red,
//                    Color.green
//                ]
//            )
        }
        .background(
            self.colorScheme == .light ? Color.white : Color.black.opacity(0.8)
        )
        .edgesIgnoringSafeArea(.all)
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
