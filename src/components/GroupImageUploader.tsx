import { useState } from "react";
import styles from "@/styles/GroupImageUploader.module.css";

type Props = {
  onUpload: (file: File, displayNo: number) => Promise<Response>;
};

const GroupImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayNo, setDisplayNo] = useState<number>(0);
  const [isBalloon, setIsBalloon] = useState(false);
  const [balloonMessage, setBalloonMessage] = useState("");

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      const res = await onUpload(selectedFile, displayNo);
      setIsBalloon(true);
      if (res.ok) {
        setSelectedFile(null);
        setPreviewUrl(null);
        setBalloonMessage("アップロードに成功しました。");
      } else {
        setBalloonMessage("アップロードに失敗しました。");
      }
    }
  };
  const handleDeleteClick = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  const handleBalloonDeleteClick = () => {
    setIsBalloon(false);
  };

  return (
    <div className={styles.container}>
      {isBalloon && (
        <div className={styles.balloonContainer}>
          <div className={styles.message}>{balloonMessage}</div>
          <button
            onClick={handleBalloonDeleteClick}
            className={styles.balloonDeleteButton}
          >
            &#x2716;
          </button>
        </div>
      )}
      <h2>Group Image Uploader</h2>
      {previewUrl && (
        <div className={styles.previewContainer}>
          <img src={previewUrl} alt="preview" className={styles.preview} />
          <button onClick={handleDeleteClick} className={styles.deleteButton}>
            &#x2716;
          </button>
        </div>
      )}
      <label htmlFor="display_no">
        表示順:
        <input
          type="number"
          id="display_no"
          name="display_no"
          value={displayNo}
          onChange={(e) => setDisplayNo(parseInt(e.target.value))}
          className={styles.input}
        />
      </label>
      <label htmlFor="file">
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className={styles.fileInput}
        />
      </label>
      <button onClick={handleUploadClick} className={styles.button}>
        Upload
      </button>
    </div>
  );
};

export default GroupImageUploader;
