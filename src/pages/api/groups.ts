import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/upload に対するハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const groups = await prisma.group.findMany();
    res.status(200).json(groups);
  }
}
