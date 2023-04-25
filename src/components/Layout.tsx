import Head from "next/head";
import styles from "@/styles/Layout.module.css";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>iBox</title>
      </Head>
      <header className={styles.header}>
        <div className={styles["header-left"]}>
          <a href="/" className={styles.h2title}>
            <h1>iBox</h1>
          </a>
        </div>
        <div>
          <a href="/group" className={styles["upload-link"]}>
            create group
          </a>
        </div>
        <div>
          <form className={styles["search-form"]}>
            <input type="text" placeholder="画像を検索" />
            <button type="submit">検索</button>
          </form>
        </div>
        <div className={styles["header-right"]}></div>
      </header>
      <main>{children}</main>
    </>
  );
}
