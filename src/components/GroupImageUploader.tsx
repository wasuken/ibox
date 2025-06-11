import { useRef, useState } from 'react'
import { Alert, Badge, Button, Card, Form, Spinner } from 'react-bootstrap'

type Props = {
  onUpload: (
    file: File,
    displayNo: number,
    fileName: string,
  ) => Promise<boolean[]>
}

const GroupImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [displayNo, setDisplayNo] = useState<number>(0)
  const [fileName, setFileName] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value)
  }

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] as File
    setSelectedFile(file)
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      setFileName(file.name)
    } else {
      setPreviewUrl(null)
    }
  }

  const clearInput = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setFileName('')
    setDisplayNo(0)
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = async () => {
    if (selectedFile) {
      setIsUploading(true)
      try {
        const [isUp] = await onUpload(selectedFile, displayNo, fileName)
        if (isUp) {
          setShowSuccess(true)
          clearInput()
          setTimeout(() => setShowSuccess(false), 3000)
        } else {
          setShowError(true)
          setTimeout(() => setShowError(false), 3000)
        }
      } finally {
        setIsUploading(false)
      }
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
      <Card.Header>
        <h5 className="mb-0">📤 単体画像アップロード</h5>
      </Card.Header>
      <Card.Body>
        {/* アラート */}
        {showSuccess && (
          <Alert variant="success" className="mb-3">
            ✅ アップロードに成功しました！
          </Alert>
        )}
        {showError && (
          <Alert variant="danger" className="mb-3">
            ❌ アップロードに失敗しました。
          </Alert>
        )}

        {/* プレビューエリア */}
        {previewUrl && (
          <Card className="mb-3">
            <Card.Body className="text-center position-relative">
              <img
                src={previewUrl}
                alt="プレビュー"
                className="img-fluid rounded"
                style={{ maxHeight: '300px', maxWidth: '100%' }}
              />
              <Button
                variant="outline-danger"
                size="sm"
                className="position-absolute top-0 end-0 m-2"
                onClick={clearInput}
              >
                ✕
              </Button>
              {selectedFile && (
                <div className="mt-2">
                  <Badge bg="secondary">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* ファイル選択 */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">画像ファイル選択</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            disabled={isUploading}
          />
          <Form.Text className="text-muted">
            JPG, PNG, GIF, WebP形式をサポート
          </Form.Text>
        </Form.Group>

        {/* ファイル名 */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">ファイル名</Form.Label>
          <Form.Control
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="ファイル名を入力"
            disabled={isUploading}
          />
        </Form.Group>

        {/* 表示順 */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">表示順</Form.Label>
          <Form.Control
            type="number"
            min={0}
            value={displayNo}
            onChange={(e) => setDisplayNo(parseInt(e.target.value) || 0)}
            disabled={isUploading}
          />
          <Form.Text className="text-muted">
            数字が小さいほど先頭に表示されます
          </Form.Text>
        </Form.Group>

        {/* アップロードボタン */}
        <div className="d-grid">
          <Button
            variant="primary"
            size="lg"
            onClick={handleUploadClick}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Spinner size="sm" className="me-2" />
                アップロード中...
              </>
            ) : (
              <>📤 アップロード実行</>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default GroupImageUploader
