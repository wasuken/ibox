import Layout from "@/components/Layout";
import { GetServerSideProps, NextPage } from "next";
import { Group } from "@/types";
import { PrismaClient } from "@prisma/client";

import GroupInfo from "@/components/GroupInfo";
import GroupImageList from "@/components/GroupImageList";
import GroupImageUploader from "@/components/GroupImageUploader";
import styles from "@/styles/GroupDetail.module.css";

import { useState } from "react";

const prisma = new PrismaClient();

type Props = {
  group: Group;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.query;
  if (typeof id !== "string") {
    return {
      props: {
        group: {},
      },
    };
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
          image: {
            select: {
              path: true,
            },
          },
        },
      },
    },
  });
  const jgroup = {
    ...JSON.parse(JSON.stringify(group)),
    name: group.title,
    tags: group.groupTags.map((t) => t.tag.name),
    images: group?.groupImages,
  };
  return {
    props: {
      group: jgroup,
    },
  };
};

const GroupPage: NextPage<Props> = (props: Props) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const menuItems = [
    "グループ詳細",
    "グループ画像アップロード",
    "グループ画像リスト",
  ];
  const contents = [
    <GroupInfo key={0} group={props.group} onSave={updateGroup} />,
    <GroupImageUploader key={1} onUpload={(_f) => {}} />,
    <GroupImageList key={2} images={props.group.images} />,
  ];
  function updateGroup(group: Group) {
    fetch(`/api/group`, {
      method: "PUT",
      body: JSON.stringify(group),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
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
