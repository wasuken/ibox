import { useState, useEffect } from "react";
import { Group, Tag } from "@/types";
import TagList from "@/components/TagList";
import GroupList from "@/components/GroupList";
import Layout from "@/components/Layout";
import styles from "@/styles/Index.module.css";

export default function Home() {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [searchText, setSearchText] = useState("");

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  function fetchGroupList() {
    fetch(`/api/groups${location.search}`)
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
  function fetchGroupSearch() {
    fetch(`/api/groups?query=${searchText}`)
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
      <div>
        <h2 className={styles.title}>検索</h2>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchInputChange}
            className={`${styles.input}`}
            placeholder="Search..."
          />
          <button
            type="button"
            className={styles.button}
            onClick={fetchGroupSearch}
          >
            Search
          </button>
        </form>
      </div>
      <TagList tagList={tagList} />
      <GroupList groupList={groupList} />
    </Layout>
  );
}
