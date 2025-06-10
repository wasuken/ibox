import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import { logging } from '@/lib/logging';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

// POST /api/upload に対するハンドラー
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  logging(req, res, async (req, res) => {
    if (req.method === 'POST') {
      const form = new formidable.IncomingForm();

      form.parse(req, async function (err, fields, files) {
        if (err) {
          res.status(500).json({
            method: req.method,
            error: err,
          });
          return;
        }
        const file = files.image as formidable.File;
        const path = file.filepath;
        const name = file.originalFilename ?? '';
        const size = file.size;
        let tags = fields.tags;
        if (tags as string[]) {
        } else {
          tags = [];
        }
        const image = await prisma.image.create({
          data: {
            name,
            path,
            size,
          },
        });
        const imageId = image.id;
        await prisma.groupImage.create({
          data: {
            imageId,
          },
        });
      });
    }
  });
}
