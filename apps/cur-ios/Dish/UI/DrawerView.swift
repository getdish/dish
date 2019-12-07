//  Created by Quentin on 2019/8/8.
//  Copyright © 2019 Quentin. All rights reserved.
//

import SwiftUI

typealias OnChangeOpen = (_ open: Bool) -> Void
typealias OnChangeDimension = (_ val: CGFloat) -> Void

struct DrawerView<Content: View>: View {
  @Binding var isShow: Bool {
    didSet {
      if let cb = changeOpenAction {
        cb(isShow)
      }
      if let cb = changeHeightAction {
        cb(computedDrawerHeight)
      }
    }
  }

  @State private var translation = CGSize.zero
  
  // The default color of back layer
  var backLayerColor = Color.black
  // The default opacity of back layer when the drawer is pulled out
  var backLayerOpacity = 0.5
  // Use the default animation of back layer
  var backLayerAnimation = Animation.easeIn
  
  var pctUntilSnap = 0.075
  
  // The default orientation of drawer
  var drawerOrientation = Axis.Set.vertical
  
  // The default height of drawer
  // Will be used when orientation set to be VERTICAL
  var defaultHeight: CGFloat?
  
  // when not shown, height
  var fullHeight: CGFloat?
  
  // when not shown, height
  var hiddenHeight: CGFloat = 0.0
  
  private var computedDrawerHeight: CGFloat {
    if let height = fullHeight {
      return height
    }
    return UIScreen.main.bounds.height / 2
  }
  
  // The default width of drawer
  // Will be used when orientation set to be HORIZANTAL
  var drawerWidth: CGFloat?
  
  private var computedDrawerWidth: CGFloat {
    if let width = drawerWidth {
      return width
    }
    return UIScreen.main.bounds.width / 2
  }
  
  var changeOpenAction: OnChangeOpen?
  var changeHeightAction: OnChangeDimension?
  
  // The default value of corner radius of drawer view
  var drawerCornerRadius: CGFloat = 20
  // The default color of the background of drawer view
  var drawerBackgroundColor = Color.init(red: 255.0, green: 255.0, blue: 255.0, opacity: 0.0)
  // The default animation of opening up drawer view
  var drawerOutAnimation = Animation.interpolatingSpring(mass: 0.5, stiffness: 45, damping: 45, initialVelocity: 15)
  var isDrawerShadowEnable = true
  var shouldAutoHideShadow = false
  var drawerShadowRadius: CGFloat = 20
  
  var outsideFrameContent: AnyView?
  var content: Content
  
  private var xOffset: CGFloat {
    if drawerOrientation == Axis.Set.horizontal {
      let origOffset = isShow ?
        -(UIScreen.main.bounds.width - computedDrawerWidth) / 2 :
        -(UIScreen.main.bounds.width + computedDrawerWidth) / 2
      return origOffset + translation.width
    }
    return 0
  }
  
  private var initYOffset: CGFloat? {
    if drawerOrientation == Axis.Set.vertical {
      return isShow ?
        (UIScreen.main.bounds.height - computedDrawerHeight) / 2 :
        (UIScreen.main.bounds.height + computedDrawerHeight) / 2
    }
    return nil
  }
  
  private var yOffset: CGFloat {
    if let y = initYOffset {
      let final = y + translation.height + (
        self.isShow ? 0 : -self.hiddenHeight
      )
      return final
    }
    return 0
  }

  var body: some View {
    
    // TODO
    // have a "percent" for pct 0-1 to start/end
    // we can use that for gradual animations
    
    let width = drawerOrientation == Axis.Set.horizontal
      ? computedDrawerWidth
      : UIScreen.main.bounds.width
    let height = drawerOrientation == Axis.Set.vertical
      ? computedDrawerHeight
      : UIScreen.main.bounds.height
    
    let dragGesture = DragGesture()
      .onChanged { (value) in
        print("drag gesture via DrawerView")
        self.translation = value.translation
      }
      .onEnded { (value) in
        let isVertical = self.drawerOrientation == Axis.Set.vertical
        let snapDistance = CGFloat(self.pctUntilSnap) * (isVertical ? height : width)
        let endTranslation = isVertical ? value.predictedEndTranslation.height : -value.predictedEndTranslation.width
        self.isShow = endTranslation < snapDistance
        self.translation = CGSize.zero
      }
    
    return ZStack {
      // Implement the darken background
      Rectangle()
        .animation(backLayerAnimation)
        .foregroundColor(backLayerColor)
        .opacity(isShow ? backLayerOpacity : 0)
        .disabled(!isShow)
        .onTapGesture {
          // The default behavior of tapping on
          // the back layer is dismissing the drawer
          self.isShow.toggle()
          
          // todo can make this optional
          closeCurrentKeyboard()
      }

      
      ZStack {
        ZStack {
          BlurView(style: .systemThinMaterial)
            .frame(width: width, height: height)
            .cornerRadius(drawerCornerRadius)
          
          // draggable background
          Rectangle()
            .foregroundColor(Color.black.opacity(0.0001))
            .gesture(dragGesture)
          
          VStack {
            VStack {
              VStack {
                Spacer().frame(height: 12)
                BarArrow(direction: self.isShow ? .down : .up)
                Spacer().frame(height: 12)
              }
            }
            .frame(maxWidth: .infinity)
            .onTapGesture {
              self.isShow.toggle()
            }
            .gesture(dragGesture)
            
            ZStack {
              content
              
              if !self.isShow {
                Rectangle()
                  .foregroundColor(Color.black.opacity(0.0001))
                  .gesture(dragGesture)
              }
            }
            
            Spacer()
          }
        }
        .background(drawerBackgroundColor)
        .cornerRadius(drawerCornerRadius)
        .shadow(
          radius: !self.isShow && self.shouldAutoHideShadow ? 0 :
            isDrawerShadowEnable ? drawerShadowRadius : 0
        )
        
        outsideFrameContent
      }
      .frame(
        width: width,
        height: height
      )
      .offset(x: xOffset, y: yOffset)
      .animation(drawerOutAnimation)
    }
  }
}

extension DrawerView {
  func onChangeOpen(perform action: @escaping OnChangeOpen) -> Self {
    var copy = self
    copy.changeOpenAction = action
    return copy
  }
}

extension DrawerView {
  func onChangeHeight(perform action: @escaping OnChangeDimension) -> Self {
    var copy = self
    copy.changeHeightAction = action
    return copy
  }
}

#if DEBUG
struct DrawerPreview: View {
  @State var showDrawer = true
  var body: some View {
    ZStack {
      DrawerView(
        isShow: self.$showDrawer,
        outsideFrameContent: AnyView(Text("OUTSIDE")
          .frame(alignment: Alignment.trailing)
          .position(x: 0, y: 0)),
        content: VStack { Text("Test") }
      )
    }
  }
}

struct DrawerView_Previews: PreviewProvider {
  static var previews: some View {
    Group {
      DrawerPreview().environment(\.colorScheme, .light)
      DrawerPreview().environment(\.colorScheme, .dark)
    }
  }
}
#endif
