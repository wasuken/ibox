import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Tag } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, tags, description } = req.body;
    const group = await prisma.group.create({
      data: {
        description,
        title,
      },
    });
    tags.forEach(async (tag: string) => {
      const resultTag = await prisma.tag.create({
        data: {
          name: tag,
        },
      });
      await prisma.groupTag.create({
        data: {
          tagId: resultTag.id,
          groupId: group.id,
        },
      });
    });
    const groupId = group.id;
    res.status(200).json({ groupId });
  }
}
