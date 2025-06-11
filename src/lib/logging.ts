import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export async function logging(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) {
  const startTime = Date.now()

  // ハンドラー関数を呼び出してレスポンスを待つ
  await handler(req, res)

  // リクエストの処理時間を計算
  const responseTime = Date.now() - startTime

  // 必要なリクエスト情報を取得
  const method = req.method
  const path = req.url
  const ipAddress = req.socket.remoteAddress
  const userAgent = req.headers['user-agent']
  const rawHeaders = JSON.stringify(req.headers)

  // ログ情報をデータベースに保存
  await prisma.accessLog.create({
    data: {
      method: method ?? '',
      path: path ?? '',
      statusCode: res.statusCode,
      responseTime: responseTime,
      ipAddress: ipAddress ?? '',
      userAgent: userAgent ?? '',
      rawHeaders: rawHeaders,
    },
  })

  await prisma.$disconnect()
}
