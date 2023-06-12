import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import { logging } from "@/lib/logging";

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  logging(req, res, async (req, res) => {
    if (req.method === "POST") {
      const { resultList: _resultList, groupId: _groupId } = JSON.parse(
        req.body
      );
      const resultList = _resultList as string[];
      const groupId = _groupId as string;
      // resultListループ
      //   1. URLから画像を取得
      //   2. 保存パスも生成
      //   3. ImageとしてDB登録
      //   4. GroupImageとして登録
      for (let i = 0; i < resultList.length; i++) {
        const url = resultList[i];
        const newDir = "./public/uploads";
        const name = url.split("/").pop();
        const fname = `${uuidv4()}_${name}`;
        // グループIDごとに画像を作成する。
        const newPath = path.join(newDir, groupId.toString(), fname);
        const webPath = path.join("/uploads", groupId.toString(), fname);

        const dirPath = newPath.replace(/\/[^/]*$/, "");
        try {
          fs.mkdirSync(dirPath, { recursive: true });
        } catch (err) {
          console.error("exists dir");
        }
        try {
          const response = await fetch(url);
          response.body?.pipe(fs.createWriteStream(newPath));
          const size = response.size;
          await prisma.image.create({
            data: {
              path: webPath,
              name: fname,
              size,
              groupImages: {
                create: [
                  {
                    groupId: parseInt(groupId),
                    display_no: i,
                  },
                ],
              },
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
      console.log("info", "uploaded");
      res.status(200).json({ msg: "success" });
      return;
    }
  });
}
