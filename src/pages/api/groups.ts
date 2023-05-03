import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/upload に対するハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const groups = await prisma.group.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        groupTags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        groupImages: {
          select: {
            image: {
              select: {
                path: true,
                name: true,
                size: true,
              },
            },
            display_no: true,
          },
          orderBy: {
            display_no: "asc",
          },
        },
      },
    });
    const jgroups = groups.map((group) => {
      let v = {
        ...JSON.parse(JSON.stringify(group)),
        name: group.title,
        tags: group.groupTags.map((t) => t.tag),
        images: group?.groupImages.map((gi) => {
          return {
            ...gi.image,
            displayNo: gi.display_no,
          };
        }),
      };
      delete v.groupImages;
      delete v.groupTags;
      return v;
    });
    res.status(200).json(jgroups);
  }
}
