import styles from "@/styles/Index.module.css";
import { Tag, SearchParams } from "@/types";

function generateHref(params: SearchParams) {
  if (!params.tag) params.tag = "";
  if (!params.query) params.query = "";
  if (!params.page) params.page = 0;
  const tagp = `tag=${params.tag}`;
  const queryp = `query=${params.query}`;
  const pagep = `page=${params.page}`;
  return `?${tagp}&${queryp}&${pagep}`;
}

interface Props {
  tagList: Tag[];
}

const initParams = () => {
  return {
    tag: "",
    query: "",
    page: 0,
  };
};

export default function TagList(props: Props) {
  const { tagList } = props;
  return (
    <div className={styles["tag-area"]}>
      <h2>タグ</h2>
      <div className={styles["tag-cloud"]}>
        {tagList.map((tag, i) => (
          <a key={i} href={generateHref({ ...initParams(), tag: tag.name })}>
            {tag.name}
          </a>
        ))}
      </div>
    </div>
  );
}
