import { logging } from '@/lib/logging'
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  logging(req, res, async (req, res) => {
    const { id: id_ } = req.query
    const id = parseInt(id_ as string)
    if (req.method === 'GET') {
      const group = await prisma.group.findFirst({
        where: {
          id,
        },
    select: {
      id: true,
      title: true,
      description: true,
      viewCount: true,
      lastViewedAt: true,
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
              id: true,
              image: {
                select: {
                  id: true,
                  path: true,
                  name: true,
                  size: true,
                },
              },
              display_no: true,
            },
            orderBy: {
              display_no: 'asc',
            },
          },
        },
      })
      if (!group) {
        res.status(400).json({ msg: 'empty group' })
        return
      }
      const jgroup = {
        ...JSON.parse(JSON.stringify(group)),
        name: group.title,
        viewCount: group.viewCount,
        lastViewedAt: group.lastViewedAt.toISOString(),
        tags: group.groupTags.map((t) => t.tag.name),
        images: group?.groupImages.map((gi) => {
          return {
            ...gi.image,
            displayNo: gi.display_no,
            groupImageId: gi.id,
          }
        }),
      }
      res.status(200).json(jgroup)
      return
    } else if (req.method === 'PUT') {
      const group = req.body
      const id = parseInt(group.id as string)
      const title = group.title as string
      const description = group.description as string
      const tags = group.tags as string[]
      await prisma.group.update({
        where: {
          id,
        },
        data: {
          title,
          description,
        },
      })
      await updateGroupTags(id, tags)
      res.status(200).json({ msg: 'success.' })
      return
    } else if (req.method === 'DELETE') {
      const id = parseInt(req.query.id as string)
      // グループイメージレコード取得
      const records = await prisma.groupImage.findMany({
        where: {
          groupId: id,
        },
      })
      const imageIdList = records.map((x) => x.imageId)
      // グループイメージ削除
      await prisma.groupImage.deleteMany({
        where: {
          groupId: id,
        },
      })
      // イメージ削除
      await prisma.image.deleteMany({
        where: {
          id: {
            in: imageIdList,
          },
        },
      })
      // グループタグ削除 タグは残したまま
      await prisma.groupTag.deleteMany({
        where: {
          groupId: id,
        },
      })
      // グループ削除
      await prisma.group.delete({
        where: {
          id: id,
        },
      })
      res.status(200).json({ msg: 'success.' })
      return
    } else {
      res.status(400).json({ msg: 'not supported' })
      return
    }
  })
}
async function updateGroupTags(groupId: number, newTags: string[]) {
  // グループの現在のタグを取得
  const currentGroupTags = await prisma.groupTag.findMany({
    where: { groupId },
    include: { tag: true },
  })

  // 現在のタグ名の配列を取得
  const currentTags = currentGroupTags.map((groupTag) => groupTag.tag.name)

  // 削除するタグを特定
  const tagsToRemove = currentTags.filter(
    (tagName) => !newTags.includes(tagName),
  )

  // 追加するタグを特定
  const tagsToAdd = newTags.filter((tagName) => !currentTags.includes(tagName))

  // グループから削除するタグを取り除く
  for (const tagName of tagsToRemove) {
    const tag = await prisma.tag.findFirst({ where: { name: tagName } })
    if (tag) {
      await prisma.groupTag.deleteMany({
        where: { groupId: groupId, tagId: tag.id },
      })
    }
  }

  // グループに追加するタグを追加する
  for (const tagName of tagsToAdd) {
    let tag = await prisma.tag.findFirst({ where: { name: tagName } })

    // タグが存在しない場合、新しいタグを作成
    if (!tag) {
      tag = await prisma.tag.create({ data: { name: tagName } })
    }

    // グループに新しいタグを追加
    await prisma.groupTag.create({
      data: {
        group: { connect: { id: groupId } },
        tag: { connect: { id: tag.id } },
      },
    })
  }
}
