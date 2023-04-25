import styles from "@/styles/Index.module.css";
import { Tag, SearchParams } from "@/types";

function generateHref(params: SearchParams) {
  if (params.tagList === undefined) params.tagList = [];
  if (params.query === undefined) params.query = "";
  if (params.page === undefined) params.page = 0;
  const tagp = params.tagList.map((tag) => `tag[]=${tag.name}`).join("&");
  const queryp = `query=${params.query}`;
  const pagep = `page=${params.page}`;
  return `?${tagp}&${queryp}&${pagep}`;
}

interface Props {
  tagList: Tag[];
}

const initParams = () => {
  return {
    tagList: undefined,
    query: undefined,
    page: undefined,
  };
};

export default function TagList(props: Props) {
  const { tagList } = props;
  return (
    <div className={styles["tag-area"]}>
      <h2>タグ</h2>
      <div className={styles["tag-cloud"]}>
        {tagList.map((tag, i) => (
          <a key={i} href={generateHref(initParams())}>
            {tag.name}
          </a>
        ))}
      </div>
    </div>
  );
}
