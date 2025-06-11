import styles from '@/styles/ImagePreviewModal.module.css'
import { Image } from '@/types'
import { useState } from 'react'

interface Props {
  images: Image[]
  onClose: () => void
  index: number
}

const ImagePreviewModal = ({ images, onClose, index }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(index)
  const imagePath = images[currentIndex].path

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
  }

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    )
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      handleNextClick()
    } else if (e.key === 'ArrowLeft') {
      handlePrevClick()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onKeyDown={handleKeyPress}>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={imagePath}
            alt={images[currentIndex].name}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              handlePrevClick()
            }}
            autoFocus
          ></button>
          <button
            className={styles.button}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              handleNextClick()
            }}
            autoFocus
          ></button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  )
}

export default ImagePreviewModal
