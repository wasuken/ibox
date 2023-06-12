import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { logging } from "@/lib/logging";

const prisma = new PrismaClient();

// POST /api/upload に対するハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  logging(req, res, async (req, res) => {
    if (req.method === "GET") {
      const tags = await prisma.tag.findMany({
        where: {
          groupTags: {
            some: {},
          },
        },
      });
      res.status(200).json(tags);
    }
  });
}
