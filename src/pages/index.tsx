import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "@/styles/Index.module.css";
// import { tags_testdata, groups_testdata } from "@/test_data";
import { Group, Tag, Image, SearchParams } from "@/types";
import TagList from "@/components/TagList";
import GroupList from "@/components/GroupList";
import Layout from "@/components/Layout";

export default function Home() {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  function fetchGroupList() {
    fetch(`/api/groups`)
      .then((res) => res.json())
      .then((js) => {
        const jss = js.map((o) => {
          return {
            ...o,
            createdAt: new Date(o.createdAt),
          };
        });
        setGroupList(jss);
      });
  }
  function fetchTagList() {
    fetch(`/api/tags`)
      .then((res) => res.json())
      .then((js) => {
        setTagList(js);
      });
  }
  useEffect(() => {
    fetchTagList();
    fetchGroupList();
  }, []);
  return (
    <Layout>
      <TagList tagList={tagList} />
      <GroupList groupList={groupList} />
    </Layout>
  );
}
