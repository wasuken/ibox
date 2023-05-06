import styles from "@/styles/GroupImageList.module.css";
import Image from "next/image";
import { Image as IImage } from "@/types";
import { useState, useEffect } from "react";
import ImagePreviewModal from "@/components/ImagePreviewModal";

type Props = {
  images: IImage[];
  onOrderUpdate: (imgs: IImage[]) => Promise<boolean[]>;
  onImageDelete: (img: IImage) => Promise<boolean[]>;
};

const GroupImageList: React.FC<Props> = ({
  images: imgs,
  onOrderUpdate,
  onImageDelete,
}) => {
  const [draggedImage, setDraggedImage] = useState<IImage | null>(null);
  const [images, setImages] = useState<IImage[]>(imgs);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
  const handleGroupImageDeleteClick = async (image: IImage) => {
    await onImageDelete(image);
  };
  const handleImageClick = (no: number) => {
    setSelectedIndex(no);
    handleOpenModal();
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
            <button
              onClick={() => handleGroupImageDeleteClick(image)}
              className={styles.deleteButton}
            >
              &#x2716;
            </button>
            <Image
              src={`http://localhost:3000${image.path}`}
              alt={`Group Image ${index + 1}`}
              className={styles.image}
              width={300}
              height={500}
              onClick={() => handleImageClick(index)}
            />
          </div>
        ))}
      </div>
      {isModalOpen && (
        <ImagePreviewModal
          index={selectedIndex}
          onClose={handleCloseModal}
          images={images}
        />
      )}
    </div>
  );
};

export default GroupImageList;
