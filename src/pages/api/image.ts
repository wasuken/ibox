import { NextApiRequest, NextApiResponse } from "next";
const formidable = require("formidable");

// これ必要なことに気づかなかった↓
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

    form.parse(req, async function (err, fields, files) {
      if (err) {
        res.status(500).json({
          method: req.method,
          error: err,
        });
        return;
      }
      const file = files.file;
      // ファイルをなんやかんやする
    });
  }
}
