import { useState, useRef } from "react";
import styles from "@/styles/GroupImageUploader.module.css";
import Image from "next/image";

type Props = {
  onUpload: (
    file: File,
    displayNo: number,
    fileName: string
  ) => Promise<boolean[]>;
};

const GroupImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayNo, setDisplayNo] = useState<number>(0);
  const [isBalloon, setIsBalloon] = useState(false);
  const [balloonMessage, setBalloonMessage] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] as File;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      setFileName(file.name);
    } else {
      setPreviewUrl(null);
    }
  };
  const clearInput = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName("");
    setDisplayNo(0);
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      const [isUp] = await onUpload(selectedFile, displayNo, fileName);
      setIsBalloon(true);
      clearInput();
      if (isUp) {
        setBalloonMessage("アップロードに成功しました。");
      } else {
        setBalloonMessage("アップロードに失敗しました。");
      }
    }
  };
  const handleDeleteClick = () => {
    clearInput();
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
          <Image
            width={500}
            height={500}
            src={previewUrl}
            alt="preview"
            className={styles.preview}
          />
          <button onClick={handleDeleteClick} className={styles.deleteButton}>
            &#x2716;
          </button>
        </div>
      )}
      <label htmlFor="display_no" className={styles.displayNolabel}>
        表示順:
        <input
          type="number"
          min={0}
          id="display_no"
          name="display_no"
          value={displayNo}
          onChange={(e) => setDisplayNo(parseInt(e.target.value))}
          className={styles.displayNo}
        />
      </label>
      <label htmlFor="file" className={styles.label}>
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className={styles.fileInput}
          ref={fileInputRef}
        />
      </label>
      <label htmlFor="fileName" className={styles.label}>
        ファイル名:
        <input
          id="fileName"
          type="text"
          onChange={handleFileNameChange}
          value={fileName}
          className={styles.input}
        />
      </label>
      <div className={styles.btnLine}>
        <button onClick={handleUploadClick} className={styles.button}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default GroupImageUploader;
