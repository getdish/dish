import path from 'path'

import { userFindOne, userUpsert } from '@dish/graph'
import AWS from 'aws-sdk'
import { Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { v4 } from 'uuid'

// if (!process.env.DO_SPACES_ID) {
//   throw new Error(`NO Docker Spaces ID provided`)
// }

const BUCKET_NAME = 'user-images'

const endpoint = 'nyc3.digitaloceanspaces.com'
const s3 = new AWS.S3({
  endpoint,
  accessKeyId: process.env.DO_SPACES_ID,
  secretAccessKey: process.env.DO_SPACES_SECRET,
})

s3.listBuckets(async (err, data) => {
  if (err) return
  if (!data.Buckets || !data.Buckets.some((x) => x.Name === BUCKET_NAME)) {
    console.log('creating bucket', BUCKET_NAME)
    s3.createBucket(
      {
        Bucket: BUCKET_NAME,
      },
      (err, data) => {
        console.log('s3 bucket create', err, data)
      }
    )
  }
})

const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const extname = path.extname(file.originalname)
      cb(null, `${v4()}${extname}`)
    },
  }),
}).array('avatar', 1)

class UserImageController {
  static uploadImage = [
    async (req: Request, res: Response, next) => {
      console.log(
        'starting',
        JSON.stringify(req.params),
        JSON.stringify(req.body)
      )
      next()
    },
    upload,
    async (req: Request, res: Response) => {
      if (!Array.isArray(req.files) || !req.files.length) {
        return res.json({
          error: 'no files',
        })
      }

      try {
        const [file] = req.files
        const { username } = req.body
        const avatar = file['location']

        console.log('now we have', username, avatar)

        const user = await userFindOne({
          username,
        })

        await userUpsert([
          {
            ...user,
            avatar,
          },
        ])

        res.json({
          avatar,
        })
      } catch (err) {
        console.error('error', err)
        return res.send(401)
      }
    },
  ]
}

export default UserImageController
