import Head from "next/head";
import { useState } from "react";
import styles from "@/styles/Index.module.css";
// import { tags_testdata, groups_testdata } from "@/test_data";
import { Group, Tag, Image, SearchParams } from "@/types";

export default function Home() {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  function generateHref(params: SearchParams) {
    if (params.tagList === undefined) params.tagList = [];
    if (params.query === undefined) params.query = "";
    if (params.page === undefined) params.page = 0;
    const tagp = tagList.map((tag) => `tag[]=${tag.name}`).join("&");
    const queryp = `query=${query}`;
    const pagep = `page=${page}`;
    return `?${tagp}&${queryp}&${pagep}`;
  }
  function fetchGroupList() {
    fetch(`/api/groups`)
      .then((res) => res.json())
      .then((js) => {
        setGroupList(js);
      });
  }
  function fetchTagList() {
    fetch(`/api/tags`)
      .then((res) => res.json())
      .then((js) => {
        setTagList(js);
      });
  }
  return (
    <>
      <Head>
        <title>画像閲覧サイト</title>
      </Head>
      <header className={styles.header}>
        <div className={styles["header-left"]}>
          <h1>画像閲覧サイト</h1>
        </div>
        <div className={styles["header-right"]}>
          <form className={styles["search-form"]}>
            <input type="text" placeholder="画像を検索" />
            <button type="submit">検索</button>
          </form>
        </div>
      </header>
      <main>
        <div className={styles["tag-area"]}>
          <h2>タグ</h2>
          <div className={styles["tag-cloud"]}>
            {tagList.map((tag, i) => (
              <a key={i} href={generateHref({ tag: tag.name })}>
                {tag.name}
              </a>
            ))}
          </div>
        </div>
        <div className={styles["group-area"]}>
          <h2>グループ</h2>
          <div className={styles["group-list"]}>
            {groupList.map((group, i) => (
              <div className={styles["group-item"]} key={i}>
                <a href="#">
                  <img src={group.path} alt={group.name} />
                  <h3>{group.name}</h3>
                  <p>
                    {group.tags &&
                      group.tags.length >= 0 &&
                      group.tags.map((t) => t.name).join(", ")}
                  </p>
                  <p>{group.createdAt.toISOString()}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
