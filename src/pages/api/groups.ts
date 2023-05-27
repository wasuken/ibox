import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const generateSearchParam = (query: string, tag: string) => {
  let search: Prisma.GroupFindManyArgs = {};
  if ((tag && tag.length > 0) || (query && query.length > 0)) {
    search = {
      where: {},
    };
  }
  if (search.where && search.where && tag && tag.length > 0) {
    search.where.groupTags = {
      some: {
        tag: {
          name: tag,
        },
      },
    };
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
    ];
  }
  return search;
};

// POST /api/upload に対するハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { query: _query, tag: _tag } = req.query;
    // console.log("debug", _query);
    const tag = _tag as string;
    const query = _query as string;
    const search = generateSearchParam(query, tag);
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
            display_no: "asc",
          },
        },
      },
    };
    const groups = await prisma.group.findMany(groupParams);
    const jgroups = groups.map((group) => {
      let v = {
        ...JSON.parse(JSON.stringify(group)),
        name: group.title,
        tags: group.groupTags.map((t) => t.tag),
        images: group?.groupImages.map((gi) => {
          return {
            ...gi.image,
            displayNo: gi.display_no,
          };
        }),
      };
      delete v.groupImages;
      delete v.groupTags;
      return v;
    });
    res.status(200).json(jgroups);
  }
}
