import path from 'path'

import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { v4 } from 'uuid'

if (!process.env.DO_SPACES_ID || !process.env.DO_SPACES_SECRET) {
  console.error(
    `Error: Missing docker credentials`,
    process.env.DO_SPACES_ID,
    process.env.DO_SPACES_SECRET
  )
}

const endpoint = 'nyc3.digitaloceanspaces.com'
const s3 = new AWS.S3({
  endpoint,
  accessKeyId: process.env.DO_SPACES_ID,
  secretAccessKey: process.env.DO_SPACES_SECRET,
})

export const createMulterUploader = (bucketName: string) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const extname = path.extname(file.originalname)
        cb(null, `${v4()}${extname}`)
      },
    }),
  })

export async function ensureBucket(name: string) {
  return new Promise((res, rej) =>
    s3.listBuckets(async (err, data) => {
      if (err) return rej(err)
      if (!data.Buckets || !data.Buckets.some((x) => x.Name === name)) {
        console.log('creating bucket', name)
        s3.createBucket(
          {
            Bucket: name,
          },
          (err, data) => {
            if (err) rej(err)
            console.log('s3 bucket create', err, data)
            res(data)
          }
        )
      }
    })
  )
}
