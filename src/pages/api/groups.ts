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
      const { query: _query, tag: _tag, sort: _sort } = req.query
      const tag = Array.isArray(_tag) ? _tag[0] : (_tag as string)
      const query = Array.isArray(_query) ? _query[0] : (_query as string)
      const sort = Array.isArray(_sort) ? _sort[0] : (_sort as string)
      const search = generateSearchParam(query, tag)
      const orderBy = generateOrderBy(sort)

      const groupParams = {
        ...search,
        ...(orderBy ? { orderBy } : {}),
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          viewCount: true,
          lastViewedAt: true,
          updatedAt: true,
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
            if (!v.lastViewedAt) {
              v.lastViewedAt = null
            }
            return v
          }
          return null
        })
        .filter((x) => x !== null)
      res.status(200).json(jgroups)
    }
  })
}

const generateSearchParam = (query?: string, tag?: string) => {
  const hasQuery = typeof query === 'string' && query.length > 0
  const hasTag = typeof tag === 'string' && tag.length > 0
  let search: Prisma.GroupFindManyArgs = {}
  if (hasTag || hasQuery) {
    search = {
      where: {},
    }
  }
  if (search.where && hasTag && tag) {
    search.where.groupTags = {
      some: {
        tag: {
          name: tag,
        },
      },
    }
  }
  if (search.where && hasQuery && query) {
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

const generateOrderBy = (sort?: string) => {
  switch (sort) {
    case 'views_desc':
      return { viewCount: Prisma.SortOrder.desc }
    case 'views_asc':
      return { viewCount: Prisma.SortOrder.asc }
    case 'created_asc':
      return { createdAt: Prisma.SortOrder.asc }
    case 'created_desc':
      return { createdAt: Prisma.SortOrder.desc }
    case 'updated_asc':
      return { updatedAt: Prisma.SortOrder.asc }
    case 'updated_desc':
      return { updatedAt: Prisma.SortOrder.desc }
    case 'name_asc':
      return { title: Prisma.SortOrder.asc }
    case 'name_desc':
      return { title: Prisma.SortOrder.desc }
    default:
      return { createdAt: Prisma.SortOrder.desc }
  }
}
