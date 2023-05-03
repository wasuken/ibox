import styles from "@/styles/GroupImageList.module.css";
import Image from "next/image";
import { Image as IImage } from "@/types";

type Props = {
  images: IImage[];
};

const GroupImageList: React.FC<Props> = ({ images }) => {
  return (
    <div className={styles.container}>
      <h2>Group Image List</h2>
      <div className={styles.list}>
        {(images ?? []).map((image, index) => (
          <div key={index} className={styles.item}>
            <span className={styles.displayNo}>{image.displayNo}</span>
            <Image
              src={`http://localhost:3000${image.path}`}
              alt={`Group Image ${index + 1}`}
              className={styles.image}
              width={300}
              height={500}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupImageList;
