import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Tag } from '@prisma/client';
import { logging } from '@/lib/logging';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  logging(req, res, async (req, res) => {
    if (req.method === 'POST') {
      const { title, tags, description } = req.body;
      const group = await prisma.group.create({
        data: {
          description,
          title,
        },
      });
      tags.forEach(async (tag: string) => {
        const findOrCreate = async () => {
          const resultExistsTag = await prisma.tag.findFirst({
            where: {
              name: tag,
            },
          });
          if (resultExistsTag) {
            return resultExistsTag;
          }
          return await prisma.tag.create({
            data: {
              name: tag,
            },
          });
        };
        await prisma.groupTag.create({
          data: {
            tagId: (await findOrCreate()).id,
            groupId: group.id,
          },
        });
      });
      const groupId = group.id;
      res.status(200).json({ groupId });
    }
  });
}
