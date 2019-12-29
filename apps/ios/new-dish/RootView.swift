//
//  ContentView.swift
//  new-dish
//
//  Created by Majid Jabrayilov on 12/5/19.
//  Copyright © 2019 Majid Jabrayilov. All rights reserved.
//
import SwiftUI

struct RootView: View {
    let inputEvents: InputEvents = InputEvents()
    
    var body: some View {
        ContextMenuRootView {
            HomeContainerView()
        }
        .edgesIgnoringSafeArea(.all)
        .environment(\.inputEvents, inputEvents)
    }
}

struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}

class InputEvents {
    init() {
        print("adding notification thing")
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(self.keyDown),
            name: UITextView.textDidChangeNotification,
            object: nil
        )
    }
    
    @objc func keyDown(notification: NSNotification) {
        print("got keydown notification... \(notification.object)")
    }
}
