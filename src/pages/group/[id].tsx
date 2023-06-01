import Layout from "@/components/Layout";
import { GetServerSideProps, NextPage } from "next";
import { Group, Image } from "@/types";
import { PrismaClient } from "@prisma/client";

import GroupInfo from "@/components/GroupInfo";
import GroupImageListUp from "@/components/GroupImageListUp";
import GroupImageCrawler from "@/components/GroupImageCrawler";
import styles from "@/styles/GroupDetail.module.css";

import { useState } from "react";

const prisma = new PrismaClient();

type Props = {
  group: Group;
};

const emptyResponse = {
  props: {
    group: {},
  },
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.query;
  if (typeof id !== "string") {
    return emptyResponse;
  }
  const group = await prisma.group.findFirst({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      title: true,
      description: true,
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
          display_no: "asc",
        },
      },
    },
  });
  if (!group) return emptyResponse;
  const jgroup = {
    ...JSON.parse(JSON.stringify(group)),
    name: group.title,
    tags: group.groupTags.map((t) => t.tag.name),
    images: group?.groupImages.map((gi) => {
      return {
        ...gi.image,
        displayNo: gi.display_no,
        groupImageId: gi.id,
      };
    }),
  };
  return {
    props: {
      group: jgroup,
    },
  };
};

const GroupPage: NextPage<Props> = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [group, setGroup] = useState<Group>(props.group);
  const [images, setImages] = useState<Image[]>(props.group.images);
  const fetchGroup = async () => {
    const id = props.group.id;
    try {
      const res = await fetch(`/api/group/${id}`);
      const resj = await res.json();
      setGroup(resj);
      setImages(resj.images);
      return true;
    } catch (e) {
      return false;
    }
  };
  const postImage = async (
    imageFile: File,
    displayNo: number,
    fileName: string
  ) => {
    const formData = new FormData();
    formData.set("image", imageFile);
    formData.set("name", fileName);
    formData.set("size", imageFile.size.toString());
    formData.set("displayNo", displayNo.toString());
    formData.set("groupId", group.id.toString());
    const res = await fetch(`/api/group/image`, {
      method: "POST",
      body: formData,
    });
    const ress = await fetchGroup();
    return [res.ok, ress];
  };
  const updateGroup = async (group: Group) => {
    const res = await fetch(`/api/group/${group.id}`, {
      method: "PUT",
      body: JSON.stringify(group),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ress = await fetchGroup();
    return [res.ok, ress];
  };
  const onOrderUpdate = async (iimages: Image[]) => {
    const idNoList = iimages.map((image, no) => [image.groupImageId, no]);
    const res = await fetch(`/api/group/image/order`, {
      method: "PUT",
      body: JSON.stringify(idNoList),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ress = await fetchGroup();
    return [res.ok, ress];
  };
  const onImageDelete = async (img: Image) => {
    const res = await fetch(`/api/group/image/${img.groupImageId}`, {
      method: "DELETE",
    });
    const ress = await fetchGroup();
    return [res.ok, ress];
  };
  const menuItems = [
    "グループ詳細",
    "アップロード/画像リスト",
    "クローラーツール",
  ];
  const contents = [
    <GroupInfo key={0} group={group} onSave={updateGroup} />,
    <GroupImageListUp
      key={1}
      onUpload={postImage}
      images={images}
      onOrderUpdate={onOrderUpdate}
      onImageDelete={onImageDelete}
    />,
    <GroupImageCrawler groupId={group.id} key={2} />,
  ];
  return (
    <Layout>
      <div className={styles.panel}>
        <div className={styles.menu}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`${styles.menuItem} ${
                index === selectedItem ? styles.active : ""
              }`}
              onClick={() => setSelectedItem(index)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={styles.content}>{contents[selectedItem]}</div>
      </div>
    </Layout>
  );
};

export default GroupPage;
