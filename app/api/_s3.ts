import {
  AbortMultipartUploadCommandOutput,
  BucketAlreadyExists,
  CompleteMultipartUploadCommandOutput,
  CreateBucketCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import busboy from 'busboy'
import { Request } from 'express'
import { PassThrough } from 'stream'

if (!process.env.DO_SPACES_ID || !process.env.DO_SPACES_SECRET) {
  console.error(
    `Error: Missing s3 credentials`,
    process.env.DO_SPACES_ID,
    process.env.DO_SPACES_SECRET
  )
}

const endpoint = 'https://sfo2.digitaloceanspaces.com'

export const s3 = new S3Client({
  endpoint,
  credentials: {
    accessKeyId: process.env.DO_SPACES_ID || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || '',
  },
})

export async function uploadMultipartFiles(
  req: Request,
  bucket: string,
  getFileName?: (filename: string) => string
) {
  const bb = busboy({ headers: req.headers })

  type FileUploadResponse = {
    name: string
    response: Promise<AbortMultipartUploadCommandOutput | CompleteMultipartUploadCommandOutput>
  }

  const uploads: FileUploadResponse[] = []

  bb.on('file', (_nameIn, file, info) => {
    const name = getFileName?.(info.filename) || info.filename
    uploads.push({
      name,
      response: uploadMultipart({
        Bucket: bucket,
        Key: name,
        Body: file,
      }),
    })
  })

  await new Promise((res, rej) => {
    bb.once('close', res)
    bb.once('error', rej)
  })

  return (await Promise.all(uploads.map((x) => x.response))).map((r, index) => ({
    ...r.$metadata,
    name: uploads[index].name,
    url: `${endpoint}/${bucket}/${uploads[index].name}`,
  }))
}

export async function uploadMultipart(params: PutObjectCommandInput) {
  const upload = new Upload({
    client: s3,
    params: {
      ...params,
    },
  })
  upload.on('httpUploadProgress', (progress) => {
    console.log(progress)
  })
  return await upload.done()
}

export async function ensureBucket(name: string) {
  const command = new CreateBucketCommand({
    Bucket: name,
  })
  try {
    await s3.send(command)
  } catch (err) {
    if (err instanceof BucketAlreadyExists) {
      return
    }
    throw err
  }
}
