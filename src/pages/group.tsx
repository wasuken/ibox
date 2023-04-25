import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

import styles from "@/styles/Group.module.css";

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isBalloon, setIsBalloon] = useState(false);
  const [balloonMessage, setBalloonMessage] = useState("");

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (inputValue.trim()) {
        setTags(Array.from(new Set([...tags, inputValue.trim()])));
        setInputValue("");
      }
    }
  };

  const handleTagClick = (tag) => {
    alert(tag);
    setTags(tags.filter((t) => t !== tag));
  };

  const tagButtons = tags.map((tag, index) => (
    <button
      className={styles.tagButton}
      key={index}
      onClick={() => handleTagClick(tag)}
    >
      {tag}
    </button>
  ));

  const handleSubmit = (event) => {
    event.preventDefault();
    const bodyObj = {
      title,
      tags,
      description,
    };
    const body = JSON.stringify(bodyObj);
    fetch(`/api/group`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((_resj) => {
        setBalloonMessage("登録完了");
        setIsBalloon(true);
        setTitle("");
        setTags([]);
        setInputValue("");
        setDescription("");
      });
  };
  const handleBack = (event) => {
    event.preventDefault();
    router.replace("/");
  };

  return (
    <Layout>
      <form className={styles.form}>
        {isBalloon && (
          <div className={styles.container}>
            <div className={styles.balloon}>{balloonMessage}</div>
          </div>
        )}
        <label className={styles.label}>
          グループ名:
          <input
            className={styles.input}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="タイトルを入力してください"
            required
          />
        </label>
        <label className={styles.label}>
          グループのタグ:
          <div className={styles.container}>
            <div className={styles.tagContainer}>{tagButtons}</div>
            <input
              className={styles.input}
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="タグを追加 (カンマ区切り)"
            />
          </div>
        </label>

        <label className={styles.label}>
          グループの説明:
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="ファイルの説明を入力してください"
            required
          />
        </label>

        <div className={styles.btnline}>
          <button
            className={styles.button}
            type="button"
            onClick={handleSubmit}
          >
            登録
          </button>
          <button className={styles.button} type="button" onClick={handleBack}>
            戻る
          </button>
        </div>
      </form>
    </Layout>
  );
}
