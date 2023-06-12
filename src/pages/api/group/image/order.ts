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
    if (req.method === "PUT") {
      const _idNoList = req.body;
      const idNoList = _idNoList as string[][];
      for (let i = 0; i < idNoList.length; i++) {
        const idNo = idNoList[i];
        const [id, display_no] = idNo.map((v) => parseInt(v));
        await prisma.groupImage.update({
          where: {
            id,
          },
          data: {
            display_no,
          },
        });
      }
      res.status(200).json({ msg: "success" });
      return;
    }
  });
}
