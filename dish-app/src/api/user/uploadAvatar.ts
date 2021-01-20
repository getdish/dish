import path from 'path'

import { runMiddleware } from '@dish/api'
import { userUpsert } from '@dish/graph'
import AWS from 'aws-sdk'
import { Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { v4 } from 'uuid'

import { getUserFromRoute, secureRoute } from './_user'

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

export default secureRoute('user', async (req: Request, res: Response) => {
  await runMiddleware(req, res, upload)
  console.log('what is', req['files'], req['file'])

  upload(req, res, async (error) => {
    if (error) {
      return res.json({
        error,
      })
    }

    const user = await getUserFromRoute(req)

    if (!user) {
      return res.json({
        error: 'no user',
      })
    }

    // @ts-expect-error
    const files = req.files

    if (!Array.isArray(files) || !files.length) {
      return res.status(500).json({
        error: 'no files',
      })
    }

    try {
      const [file] = files
      const avatar = file['location']

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
  })
})
