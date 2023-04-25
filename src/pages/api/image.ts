import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

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
      const file = files.image as formidable.File;
      const path = file.filepath;
      const name = file.originalFilename;
      const mime = file.mimetype;
      const tags = fields.tags;
    });
  }
}
