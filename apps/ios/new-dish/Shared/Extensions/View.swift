//
//  View.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

extension View {
    func eraseToAnyView() -> AnyView {
        AnyView(self)
    }

    func embedInNavigation() -> some View {
        NavigationView { self }
    }

    func embedInScroll(alignment: Alignment = .center) -> some View {
        GeometryReader { proxy in
            ScrollView {
                self.frame(
                    minHeight: proxy.size.height,
                    maxHeight: .infinity,
                    alignment: alignment
                )
            }
        }
    }
}
