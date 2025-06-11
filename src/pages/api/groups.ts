import { logging } from '@/lib/logging'
import { Prisma, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

// POST /api/upload に対するハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  logging(req, res, async (req, res) => {
    if (req.method === 'GET') {
      const { query: _query, tag: _tag } = req.query
      const tag = _tag as string
      const query = _query as string
      const search = generateSearchParam(query, tag)

      const groupParams = {
        ...search,
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
              display_no: Prisma.SortOrder.asc, // ここを修正
            },
          },
        },
      }

      const groups = await prisma.group.findMany(groupParams)
      // 以下は同じ
      const jgroups = groups
        .map((group) => {
          if (group !== null) {
            let v = {
              ...JSON.parse(JSON.stringify(group)),
              name: group.title,
              tags: group.groupTags.map((t) => t.tag),
              images: group?.groupImages.map((gi) => {
                return {
                  ...gi.image,
                  displayNo: gi.display_no,
                }
              }),
            }
            delete v.groupImages
            delete v.groupTags
            return v
          }
          return null
        })
        .filter((x) => x !== null)
      res.status(200).json(jgroups)
    }
  })
}

const generateSearchParam = (query: string, tag: string) => {
  let search: Prisma.GroupFindManyArgs = {}
  if ((tag && tag.length > 0) || (query && query.length > 0)) {
    search = {
      where: {},
    }
  }
  if (search.where && search.where && tag && tag.length > 0) {
    search.where.groupTags = {
      some: {
        tag: {
          name: tag,
        },
      },
    }
  }
  if (search.where && query.length > 0) {
    search.where.OR = [
      {
        title: {
          contains: query,
        },
      },
      {
        description: {
          contains: query,
        },
      },
    ]
  }
  return search
}
