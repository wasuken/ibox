import { useState } from "react";
import styles from "@/styles/ImagePreviewModal.module.css";
import { Image } from "@/types";

interface Props {
  images: Image[];
  onClose: () => void;
  index: number;
}

const ImagePreviewModal = ({ images, onClose, index }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const imagePath = images[currentIndex].path;

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={imagePath}
            alt={images[currentIndex].name}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handlePrevClick}>
            ＜
          </button>
          <button className={styles.button} onClick={handleNextClick}>
            ＞
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
