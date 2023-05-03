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
          <a
            href={`/group/${group.id}`}
            className={styles["group-item"]}
            key={i}
          >
            <div>
              {group.images?.length > 0 && (
                <NextImage
                  width={500}
                  height={500}
                  src={group.images[0].path}
                  alt={group.images[0].name}
                />
              )}
              <h3>{group.name}</h3>
              <p>
                {group.tags &&
                  group.tags.length >= 0 &&
                  group.tags.map((t) => t.name).join(", ")}
              </p>
              <p>{group.createdAt.toLocaleString()}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
