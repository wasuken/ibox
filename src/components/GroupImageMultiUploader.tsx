import styles from '@/styles/GroupImageMultiUploader.module.css'
import { useRef, useState } from 'react'

type Props = {
  onUpload: (
    file: File,
    displayNo: number,
    fileName: string,
  ) => Promise<boolean[]>
}

type UploadRecord = {
  file: File
  url: string
}

const GroupImageMultiUploader: React.FC<Props> = ({ onUpload }) => {
  const [previewURLList, setPreviewURLList] = useState<UploadRecord[]>([])
  const [isBalloon, setIsBalloon] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [balloonMessage, setBalloonMessage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files: FileList | null = event.target.files
    if (files) {
      let plist = []
      for (let i = 0; i < files.length; i++) {
        plist.push(
          new Promise((resolve) => {
            const file = files[i]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
              resolve({
                url: reader.result as string,
                file,
              })
            }
          }),
        )
      }
      Promise.all(plist).then((values) => {
        setPreviewURLList([...previewURLList, ...values])
      })
    }
  }
  const clearInput = () => {
    setPreviewURLList([])
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    setLoading(true)
    new Promise(async (_resolve) => {
      if (previewURLList.length > 0) {
        let isAllUp = true
        for (let i = 0; i < previewURLList.length; i++) {
          const [isUp] = await onUpload(
            previewURLList[i].file,
            i,
            previewURLList[i].file.name,
          )
          isAllUp = isAllUp && isUp
        }
        setIsBalloon(true)
        clearInput()
        if (isAllUp) {
          setBalloonMessage('すべてのアップロードに成功しました。')
        } else {
          setBalloonMessage('アップロードに失敗しました。')
        }
      }
    }).then(() => setLoading(false))
  }
  const handleDeleteClick = (i: number) => {
    setPreviewURLList([
      ...previewURLList.slice(0, i),
      ...previewURLList.slice(i + 1, previewURLList.length),
    ])
  }
  const handleBalloonDeleteClick = () => {
    setIsBalloon(false)
  }
  if (loading) {
    return <div className={styles.loader}>Loading...</div>
  }

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
      <div className={styles.previewImageList}>
        {previewURLList.length > 0 &&
          previewURLList.map((rec, i) => (
            <div className={styles.previewContainer} key={i}>
              <img src={rec.url} alt="preview" className={styles.preview} />

              <button
                onClick={() => handleDeleteClick(i)}
                className={styles.deleteButton}
              >
                &#x2716;
              </button>
            </div>
          ))}
      </div>
      <label htmlFor="file" className={styles.label}>
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className={styles.fileInput}
          ref={fileInputRef}
          multiple
        />
      </label>
      <div className={styles.btnLine}>
        <button onClick={handleUploadClick} className={styles.button}>
          Upload
        </button>
      </div>
    </div>
  )
}

export default GroupImageMultiUploader
