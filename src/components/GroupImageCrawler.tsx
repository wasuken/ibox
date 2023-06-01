import { useState } from "react";
import styles from "@/styles/GroupImageCrawler.module.css";

interface Props {
  groupId: number;
}

export default function GroupImageCrawler(props: Props) {
  const groupId = props.groupId;
  const [url, setURL] = useState<string>("");
  const [css, setCSS] = useState<string>("");
  // const [resultType, setResultType] = useState<string>("");
  const [resultList, setResultList] = useState<string[]>([]);
  const handleClickPostImageList = async () => {
    fetch(`/api/group/uploader`, {
      method: "POST",
      body: JSON.stringify({
        groupId,
        resultList,
      }),
    });
  };
  const fetchResult = async () => {
    const res = await fetch(
      `/api/crawler?url=${encodeURIComponent(url)}&css=${encodeURIComponent(
        css
      )}`
    );
    const resj = await res.json();
    setResultList(resj.result);
  };
  const changeURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
  };
  const changeCSS = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCSS(e.target.value);
  };
  const handleFetchClick = () => {
    fetchResult().then(() => console.log("info", "success"));
  };
  const handleDeleteClick = (i: number) => {
    let nlist = [...resultList];
    nlist.splice(i, 1);
    setResultList(nlist);
  };
  return (
    <div className={styles.container}>
      <h2>Image Crawler</h2>
      <label htmlFor="URL">
        URL:
        <input
          type="url"
          id="url"
          name="url"
          value={url}
          className={styles.input}
          placeholder="URL"
          onChange={changeURL}
        />
      </label>
      <label htmlFor="CSS">
        CSS:
        <input
          type="text"
          id="css"
          name="css"
          value={css}
          className={styles.input}
          placeholder="CSS"
          onChange={changeCSS}
        />
      </label>
      {resultList.length > 0 && (
        <div className={styles.btnLine}>
          <button
            type="button"
            onClick={handleClickPostImageList}
            className={styles.button}
          >
            表示されてる画像をこのグループにアップロード
          </button>
        </div>
      )}
      <div className={styles.btnLine}>
        <button
          type="button"
          onClick={handleFetchClick}
          className={styles.button}
        >
          画像を取得
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {resultList.map((x, key) => (
          <div key={key} style={{ position: "relative" }}>
            <button
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                width: "30px",
                height: "30px",
                padding: "0px",
              }}
              onClick={() => handleDeleteClick(key)}
            >
              x
            </button>
            <img src={x} />
          </div>
        ))}
      </div>
    </div>
  );
}
