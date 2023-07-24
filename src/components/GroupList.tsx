import styles from "@/styles/Index.module.css";
import NextImage from "next/image";
import { Group } from "@/types";

interface Props {
  groupList: Group[];
}

export default function GroupList(props: Props) {
  const { groupList } = props;
  return (
    <div className={styles["group-area"]}>
      <h2>グループ</h2>
      <div className={styles["group-list"]}>
        {groupList.map((group, i) => (
          <div key={i} className={styles["group-item"]}>
            <div>
              {group.images?.length > 0 && (
                <NextImage
                  width={500}
                  height={500}
                  src={group.images[0].path}
                  alt={group.images[0].name}
                />
              )}
              <h3>
                <a href={`/group/${group.id}`}>{group.name}</a>
              </h3>
              <p>
                {group.tags &&
                  group.tags.length >= 0 &&
                  group.tags.map((t, i) => (
                    <a key={i} href={`/?tag=${t.name}&page=0&query=`}>
                      {t.name}
                    </a>
                  ))}
              </p>
              <p>{group.createdAt.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
