import path from 'path'

import { userUpsert } from '@dish/graph'
import AWS from 'aws-sdk'
import { Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { v4 } from 'uuid'

const endpoint = 'nyc3.digitaloceanspaces.com'
const spacesEndpoint = new AWS.Endpoint(endpoint)
const s3 = new AWS.S3({
  endpoint: spacesEndpoint as any,
  accessKeyId: process.env.DO_SPACES_ID,
  secretAccessKey: process.env.DO_SPACES_SECRET,
})

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'user-images',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const extname = path.extname(file.originalname)
      cb(null, `${v4()}${extname}`)
    },
  }),
}).array('upload', 1)

class UserImageController {
  static uploadImage = [
    upload,
    async (req: Request, res: Response) => {
      console.log('finishing', req)
      res.json({})
      // const fileName = req.file.filename

      // userUpsert([
      //   username,
      //   avatar: `https://${endpoint}`
      // ])
    },
  ]
}

export default UserImageController
