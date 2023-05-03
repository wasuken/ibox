import styles from "@/styles/GroupImageList.module.css";
import Image from "next/image";
import { Image as IImage } from "@/types";
import { useState, useEffect } from "react";

type Props = {
  images: IImage[];
  onOrderUpdate: (imgs: IImage[]) => Promise<boolean[]>;
};

const GroupImageList: React.FC<Props> = ({ images: imgs, onOrderUpdate }) => {
  const [draggedImage, setDraggedImage] = useState<IImage | null>(null);
  const [images, setImages] = useState<IImage[]>(imgs);

  const handleDragStart = (
    _event: React.DragEvent<HTMLDivElement>,
    image: IImage
  ) => {
    setDraggedImage(image);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetImage: IImage
  ) => {
    event.preventDefault();
    const dimg = draggedImage as IImage;
    const draggedIndex = images.indexOf(dimg);
    const targetIndex = images.indexOf(targetImage);
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newImages = [...images];
      newImages.splice(draggedIndex, 1);
      newImages.splice(targetIndex, 0, dimg);
      setImages(newImages);
    }
  };
  const onOrderUpdateNow = () => {
    onOrderUpdate(images);
  };
  useEffect(() => {
    setImages(imgs);
  }, [imgs]);
  return (
    <div className={styles.container}>
      <h2>Group Image List</h2>
      <div className={styles.optionLine}>
        <button onClick={onOrderUpdateNow} className={styles.button}>
          現在の並びで表示番号を更新する
        </button>
      </div>
      <div className={styles.list}>
        {(images ?? []).map((image, index) => (
          <div
            key={index}
            className={styles.item}
            draggable={true}
            onDragStart={(event) => handleDragStart(event, image)}
            onDragOver={(event) => handleDragOver(event)}
            onDrop={(event) => handleDrop(event, image)}
          >
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
