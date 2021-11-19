import { UploadType, uploadFile } from '@dish/graph'
import { Toast } from '@dish/ui'
import { useRef } from 'react'

export const useImageUploadForm = (type: UploadType) => {
  const ref = useRef<HTMLFormElement>(null)

  return {
    async upload() {
      const form = ref.current
      if (!form) {
        console.error('no form ref')
        return
      }
      const formData = new FormData(form!)
      Toast.show('Uploading...')
      return await uploadFile(type, formData)
    },
    ref,
  }
}

// async function uploadImageAsync(uri) {
//   let apiUrl = 'https://file-upload-example-backend-dkhqoilqqn.now.sh/upload';

//   // Note:
//   // Uncomment this if you want to experiment with local server
//   //
//   // if (Constants.isDevice) {
//   //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
//   // } else {
//   //   apiUrl = `http://localhost:3000/upload`
//   // }

//   let uriParts = uri.split('.');
//   let fileType = uriParts[uriParts.length - 1];

//   let formData = new FormData();
//   formData.append('photo', {
//     uri,
//     name: `photo.${fileType}`,
//     type: `image/${fileType}`,
//   });

//   let options = {
//     method: 'POST',
//     body: formData,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'multipart/form-data',
//     },
//   };

//   return fetch(apiUrl, options);
// }
