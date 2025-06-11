import { useRef, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  ProgressBar,
  Row,
  Spinner,
} from 'react-bootstrap'

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
  name: string
}

const GroupImageMultiUploader: React.FC<Props> = ({ onUpload }) => {
  const [previewList, setPreviewList] = useState<UploadRecord[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files: FileList | null = event.target.files
    if (files) {
      const newRecords: UploadRecord[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const url = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })

        newRecords.push({
          file,
          url,
          name: file.name,
        })
      }

      setPreviewList([...previewList, ...newRecords])
    }
  }

  const clearAll = () => {
    setPreviewList([])
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = ''
    }
  }

  const removeItem = (index: number) => {
    setPreviewList(previewList.filter((_, i) => i !== index))
  }

  const handleUploadClick = async () => {
    if (previewList.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)
    let successCount = 0

    try {
      for (let i = 0; i < previewList.length; i++) {
        const record = previewList[i]
        const [isUp] = await onUpload(record.file, i, record.name)

        if (isUp) successCount++
        setUploadProgress(((i + 1) / previewList.length) * 100)
      }

      setSuccessMessage(
        `${successCount}/${previewList.length} ファイルのアップロードが完了しました`,
      )
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)

      if (successCount === previewList.length) {
        clearAll()
      }
    } catch (error) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📦 一括画像アップロード</h5>
        {previewList.length > 0 && (
          <Badge bg="primary">{previewList.length} ファイル選択中</Badge>
        )}
      </Card.Header>
      <Card.Body>
        {/* アラート */}
        {showSuccess && (
          <Alert variant="success" className="mb-3">
            ✅ {successMessage}
          </Alert>
        )}
        {showError && (
          <Alert variant="danger" className="mb-3">
            ❌ アップロードでエラーが発生しました。
          </Alert>
        )}

        {/* プログレスバー */}
        {isUploading && (
          <div className="mb-3">
            <ProgressBar
              now={uploadProgress}
              label={`${Math.round(uploadProgress)}%`}
              animated
            />
          </div>
        )}

        {/* ファイル選択 */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">
            画像ファイル選択（複数可）
          </Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            ref={fileInputRef}
            disabled={isUploading}
          />
          <Form.Text className="text-muted">
            複数ファイルを一度に選択できます（Ctrl+クリック）
          </Form.Text>
        </Form.Group>

        {/* プレビューリスト */}
        {previewList.length > 0 && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold">選択されたファイル</h6>
              <Button variant="outline-secondary" size="sm" onClick={clearAll}>
                全クリア
              </Button>
            </div>

            <Row
              className="g-2"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {previewList.map((record, index) => (
                <Col xs={6} md={4} lg={3} key={index}>
                  <Card className="position-relative">
                    <img
                      src={record.url}
                      alt="プレビュー"
                      className="card-img-top"
                      style={{
                        height: '120px',
                        objectFit: 'cover',
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-1"
                      onClick={() => removeItem(index)}
                      style={{ padding: '2px 6px' }}
                    >
                      ✕
                    </Button>
                    <Card.Body className="p-2">
                      <small className="text-truncate d-block">
                        {record.name}
                      </small>
                      <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>
                        {formatFileSize(record.file.size)}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* アップロードボタン */}
        <div className="d-grid">
          <Button
            variant="success"
            size="lg"
            onClick={handleUploadClick}
            disabled={previewList.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Spinner size="sm" className="me-2" />
                一括アップロード中... ({Math.round(uploadProgress)}%)
              </>
            ) : (
              <>📦 {previewList.length}ファイルを一括アップロード</>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default GroupImageMultiUploader
