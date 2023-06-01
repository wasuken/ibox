import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
      console.log("debug", req.body);
      form.parse(req, async function (err, fields, files) {
        if (err) {
          res.status(500).json({
            method: req.method,
            error: err,
          });
          return;
        }
        const file = files.image as formidable.File;
        const size = file.size;
        const displayNo = fields.displayNo as string;
        const groupId = fields.groupId as string;

        const originPath = file.filepath;
        const newDir = "./public/uploads";
        const name = fields.name as string;
        const fname = `${uuidv4()}_${name}`;
        // グループIDごとに画像を作成する。
        const newPath = path.join(newDir, groupId, fname);
        const webPath = path.join("/uploads", groupId, fname);

        const dirPath = newPath.replace(/\/[^/]*$/, "");
        try {
          fs.mkdirSync(dirPath, { recursive: true });
        } catch (err) {
          console.error("exists dir");
        }

        fs.copyFile(originPath, newPath, (err) => {
          if (err) throw err;
          fs.unlink(originPath, (err) => {
            if (err) throw err;
          });
        });

        await prisma.image.create({
          data: {
            path: webPath,
            name: fname,
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
