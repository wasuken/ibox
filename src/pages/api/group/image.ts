import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

// POST /api/upload に対するハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    try {
      form.parse(req, async function (err, fields, files) {
        if (err) {
          res.status(500).json({
            method: req.method,
            error: err,
          });
          return;
        }
        const file = files.image as formidable.File;
        const originPath = file.filepath;
        const newDir = "./public/uploads";
        const name = fields.name as string;
        const newPath = path.join(newDir, name);
        const webPath = path.join("/uploads", name);

        fs.copyFile(originPath, newPath, (err) => {
          if (err) throw err;
          fs.unlink(originPath, (err) => {
            if (err) throw err;
          });
        });

        const size = file.size;
        const displayNo = fields.displayNo as string;
        const groupId = fields.groupId as string;
        await prisma.image.create({
          data: {
            path: webPath,
            name,
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
        });
        res.status(200).json({ msg: "success" });
      });
    } catch (e) {
      res.status(501).json({ msg: "server error" });
    }
    return;
  }
}
