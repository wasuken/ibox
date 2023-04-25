import { PrismaClient, Tag } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import { IMAGE_PATH } from '../../const'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({ multiples: true });
    const groupId = Number(req.query.groupId);
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ message: '画像のアップロードに失敗しました。' });
        return;
      }
      const { tagIds } = fields;
      const group = await prisma.group.findUnique({ where: { id: groupId } });
      if (!group) {
        res.status(404).json({ message: '指定されたグループは存在しません。' });
        return;
      }
      const imagePromises = (Array.isArray(files.images) ? files.images : [files.images])
        .map((image) => {
          const filename = `${Date.now()}_${image.name}`;
          const imagePath = `${IMAGE_PATH}/${filename}`;
          return fs.writeFile(imagePath, image.data)
				   .then(() => prisma.image.create({ data: { path: `${filename}` } }));
        });
      const images = await Promise.all(imagePromises);
      const tagPromises = (Array.isArray(tagIds) ? tagIds : [tagIds])
        .map(async (tagId) => {
          const tag = await prisma.tag.findUnique({ where: { id: Number(tagId) } });
          return tag ? { tag } : undefined;
        });
      const groupImagePromises = images.map(async (image) => {
        const groupImage = await prisma.groupImage.create({
          data: { image: { connect: { id: image.id } }, group: { connect: { id: groupId } } },
        });
        return groupImage;
      });
      const groupImages = await Promise.all(groupImagePromises);
      const tags = (await Promise.all(tagPromises)).filter((t): t is { tag: Tag } => Boolean(t));
      // const groupTagPromises = tags.map(async ({ tag }) => {
	  //   const
	})
  }
}
