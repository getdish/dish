//
//  HomeView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct HomeView: View {
    @State private var index = 1

    var body: some View {
        let pager = PagerView(
            pageCount: 3,
            currentIndex: self.$index
        ) {
            Color.red
            Image(systemName: "photo")
                .resizable()
            Button("Go to first page") {
                self.index = 0
            }
        }
        return pager
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
