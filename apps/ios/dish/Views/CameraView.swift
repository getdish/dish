import SwiftUI
import AVFoundation

struct CameraView: UIViewControllerRepresentable {
    class CameraViewState {
        var controller: CameraViewController? = nil
    }
    
    var state = CameraViewState()
    var isCaptured: Binding<Bool>
    
    func makeCoordinator() -> CameraView.Coordinator {
        Coordinator(self)
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: UIViewControllerRepresentableContext<CameraView>) {
        context.coordinator.update(self)
    }
    
    func makeUIViewController(context: UIViewControllerRepresentableContext<CameraView>) -> UIViewController {
        let controller = CameraViewController()
        self.state.controller = controller
        return controller
    }
    
    class Coordinator: NSObject {
        var parent: CameraView
        
        init(_ parent: CameraView) {
            self.parent = parent
            super.init()
            self.update(parent)
        }
        
        func update(_ parent: CameraView) {
            async {
                self.parent.state.controller?.update(parent)
            }
        }
    }
}

class CameraViewController: UIViewController {
    var avSession: AVCaptureSession?
    var capturePhotoOut: AVCapturePhotoOutput?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loadCamera()
        resume()
    }
    
    func loadCamera() {
        avSession = AVCaptureSession()
        
        guard let captureDevice = AVCaptureDevice.default(for: .video) else { return }
        guard let input = try? AVCaptureDeviceInput(device : captureDevice) else { return }
        avSession!.addInput(input)
        
        let cameraPreview = AVCaptureVideoPreviewLayer(session: avSession!)
        cameraPreview.videoGravity = AVLayerVideoGravity.resizeAspectFill
        view.layer.addSublayer(cameraPreview)
        cameraPreview.frame = view.frame
        
        capturePhotoOut = AVCapturePhotoOutput()
        capturePhotoOut!.isHighResolutionCaptureEnabled = true
        avSession!.addOutput(capturePhotoOut!)
        
        avSession?.startRunning()
    }
    
    func update(_ parent: CameraView) {
        if parent.isCaptured.wrappedValue == true {
            self.capture()
        } else {
            self.resume()
        }
    }
    
    func resume() {
        avSession?.startRunning()
    }
    
    func pause() {
        avSession?.stopRunning()
    }
    
    func capture() {
        self.pause()
        print("capturing")
        guard let captureOut = self.capturePhotoOut else { return }
        let photoSettings = AVCapturePhotoSettings()
        photoSettings.isHighResolutionPhotoEnabled = true
        photoSettings.embedsDepthDataInPhoto = true
        photoSettings.flashMode = .auto
        captureOut.capturePhoto(with: photoSettings, delegate: self)
    }
}

extension CameraViewController: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        guard error == nil else {
            print("Fail to capture photo: \(String(describing: error))")
            return
        }
        
        guard let imageData = photo.fileDataRepresentation() else {
            print("Fail to convert pixel buffer")
            return
        }
        
        guard let capturedImage = UIImage.init(data: imageData , scale: 1.0) else {
            print("Fail to convert image data to UIImage")
            return
        }
        
        let imgWidth = capturedImage.size.width
        let imgHeight = capturedImage.size.height
        let imgOrigin = CGPoint(x: (imgWidth - imgHeight)/2, y: (imgHeight - imgHeight)/2)
        let imgSize = CGSize(width: imgHeight, height: imgHeight)
        guard let imageRef = capturedImage.cgImage?.cropping(to: CGRect(origin: imgOrigin, size: imgSize)) else {
            print("Fail to crop image")
            return
        }
        
        let imageToSave = UIImage(cgImage: imageRef, scale: 1.0, orientation: .down)
        UIImageWriteToSavedPhotosAlbum(imageToSave, nil, nil, nil)
        
        avSession?.stopRunning()
    }
}

