import { logging } from '@/lib/logging'
import { PrismaClient } from '@prisma/client'
import formidable from 'formidable'
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export const config = {
  api: {
    bodyParser: false,
  },
}

function getFirstValue(
  value: string | string[] | undefined,
): string | undefined {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

// POST /api/upload に対するハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  logging(req, res, async (req, res) => {
    if (req.method === 'POST') {
      const form = new formidable.IncomingForm()
      try {
        console.log('debug', req.body)
        form.parse(req, async function (err, fields, files) {
          if (err) {
            res.status(500).json({
              method: req.method,
              error: err,
            })
            return
          }
          const fileData = files.image
          if (!fileData) {
            return res.status(400).json({ error: 'No image file provided' })
          }

          const file = Array.isArray(fileData) ? fileData[0] : fileData
          if (!file || !file.size) {
            return res.status(400).json({ error: 'Invalid file data' })
          }

          const size = file.size
          const displayNo = getFirstValue(fields.displayNo)
          const groupId = getFirstValue(fields.groupId)

          const originPath = file.filepath
          const newDir = './public/uploads'
          const name = getFirstValue(fields.name)

          if (!displayNo || !groupId || name) {
            return res
              .status(400)
              .json({
                error: 'Missing required fields: displayNo or groupId or name',
              })
          }

          const fname = `${uuidv4()}_${name}`
          // グループIDごとに画像を作成する。
          const newPath = path.join(newDir, groupId, fname)
          const webPath = path.join('/uploads', groupId, fname)

          const dirPath = newPath.replace(/\/[^/]*$/, '')
          try {
            fs.mkdirSync(dirPath, { recursive: true })
          } catch (err) {
            console.error('exists dir')
          }

          fs.copyFile(originPath, newPath, (err) => {
            if (err) throw err
            fs.unlink(originPath, (err) => {
              if (err) throw err
            })
          })

          await prisma.image.create({
            data: {
              path: webPath,
              name: fname,
              size,
              groupImages: {
                create: [
                  {
                    groupId: parseInt(groupId),
                    display_no: parseInt(displayNo),
                  },
                ],
              },
            },
          })
          res.status(200).json({ msg: 'success' })
        })
      } catch (e) {
        res.status(501).json({ msg: 'server error' })
      }
      return
    }
  })
}
