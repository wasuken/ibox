import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { logging } from '@/lib/logging';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  logging(req, res, async (req, res) => {
    const { id: id_ } = req.query;
    // グループ画像ID
    const id = parseInt(id_ as string);
    if (req.method === 'DELETE') {
      // グループ画像レコード削除
      const deletedGroupImage = await prisma.groupImage.delete({
        where: {
          id,
        },
      });
      // 削除したものと対応する画像レコード削除
      const deletedImage = await prisma.image.delete({
        where: {
          id: deletedGroupImage.imageId,
        },
      });
      const imgPath = path.join('public', deletedImage.path);
      // 後始末
      fs.unlink(`./${imgPath}`, err => {
        if (err) throw err;
      });
      res.status(200).json({ msg: 'success' });
      return;
    } else {
      res.status(400).json({ msg: 'not supported' });
      return;
    }
  });
}
