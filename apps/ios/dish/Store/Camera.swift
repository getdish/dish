import Combine

extension AppState {
  struct CameraState: Equatable {
    var didCapture = false
  }
}

enum CameraAction {
  case capture(_ val: Bool)
}

func cameraReducer(_ state: inout AppState, action: CameraAction) {
  switch action {
  case let .capture(val):
    state.camera.didCapture = val
  }
}
