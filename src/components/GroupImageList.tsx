import styles from "@/styles/GroupImageList.module.css";

type Props = {
  images: string[];
};

const GroupImageList: React.FC<Props> = ({ images }) => {
  return (
    <div className={styles.container}>
      <h2>Group Image List</h2>
      <div className={styles.list}>
        {(images ?? []).map((url, index) => (
          <div key={index} className={styles.item}>
            <img
              src={url}
              alt={`Group Image ${index + 1}`}
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupImageList;
