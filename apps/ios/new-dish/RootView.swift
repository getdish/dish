//
//  ContentView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct RootView: View {
    var body: some View {
//        ZStack {
//            Color.black
//            DishGalleryViewContent()
//        }
//        .embedInAppEnvironment(Mocks.galleryVisibleDish)
        HomeContainerView()
            .edgesIgnoringSafeArea(.all)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}
