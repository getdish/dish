import SwiftUI

// https://www.cs.rit.edu/~ncs/color/t_convert.html
struct RGB: Equatable {
  // Percent
  var r: Double // [0,1]
  var g: Double // [0,1]
  var b: Double // [0,1]
  
  static func toHSV(r: Double, g: Double, b: Double) -> HSV {
    let min = r < g ? (r < b ? r : b) : (g < b ? g : b)
    let max = r > g ? (r > b ? r : b) : (g > b ? g : b)
    
    let v = max
    let delta = max - min
    
    guard delta > 0.00001 else { return HSV(h: 0, s: 0, v: max) }
    guard max > 0 else { return HSV(h: -1, s: 0, v: v) } // Undefined, achromatic grey
    let s = delta / max
    
    let hue: (Double, Double) -> Double = { max, delta -> Double in
      if r == max { return (g-b)/delta } // between yellow & magenta
      else if g == max { return 2 + (b-r)/delta } // between cyan & yellow
      else { return 4 + (r-g)/delta } // between magenta & cyan
    }
    
    let h = hue(max, delta) * 60 // In degrees
    
    return HSV(h: (h < 0 ? h+360 : h) , s: s, v: v)
  }
  
  static func toHSV(rgb: RGB) -> HSV {
    toHSV(r: rgb.r, g: rgb.g, b: rgb.b)
  }
  
  var hsv: HSV {
    RGB.toHSV(rgb: self)
  }
}

struct RGBA: Equatable {
  let a: Double
  let rgb: RGB
  
  init(r: Double, g: Double, b: Double, a: Double) {
    self.a = a
    self.rgb = RGB(r: r, g: g, b: b)
  }
}

struct HSV: Equatable {
  var h: Double // Angle in degrees [0,360] or -1 as Undefined
  var s: Double // Percent [0,1]
  var v: Double // Percent [0,1]
  
  static func toRGB(h: Double, s: Double, v: Double) -> RGB {
    if s == 0 { return RGB(r: v, g: v, b: v) } // Achromatic grey
    
    let angle = (h >= 360 ? 0 : h)
    let sector = angle / 60 // Sector
    let i = floor(sector)
    let f = sector - i // Factorial part of h
    
    let p = v * (1 - s)
    let q = v * (1 - (s * f))
    let t = v * (1 - (s * (1 - f)))
    
    switch(i) {
      case 0:
        return RGB(r: v, g: t, b: p)
      case 1:
        return RGB(r: q, g: v, b: p)
      case 2:
        return RGB(r: p, g: v, b: t)
      case 3:
        return RGB(r: p, g: q, b: v)
      case 4:
        return RGB(r: t, g: p, b: v)
      default:
        return RGB(r: v, g: p, b: q)
    }
  }
  
  static func toRGB(hsv: HSV) -> RGB {
    toRGB(h: hsv.h, s: hsv.s, v: hsv.v)
  }
  
  var rgb: RGB {
    HSV.toRGB(hsv: self)
  }
  
  /// Returns a normalized point with x=h and y=v
  var point: CGPoint {
    CGPoint(x: h/360, y: v)
  }
}
