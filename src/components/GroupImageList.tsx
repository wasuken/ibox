import ImagePreviewModal from '@/components/ImagePreviewModal'
import { Image as IImage } from '@/types'
import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap'

type Props = {
  images: IImage[]
  onOrderUpdate: (imgs: IImage[]) => Promise<boolean[]>
  onImageDelete: (img: IImage) => Promise<boolean[]>
}

const GroupImageList: React.FC<Props> = ({
  images: imgs,
  onOrderUpdate,
  onImageDelete,
}) => {
  const [draggedImage, setDraggedImage] = useState<IImage | null>(null)
  const [images, setImages] = useState<IImage[]>(imgs)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const handleOpenModal = (index: number) => {
    setSelectedIndex(index)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDragStart = (
    event: React.DragEvent<HTMLElement>,
    image: IImage,
  ) => {
    setDraggedImage(image)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    targetImage: IImage,
  ) => {
    event.preventDefault()
    const dimg = draggedImage as IImage
    const draggedIndex = images.indexOf(dimg)
    const targetIndex = images.indexOf(targetImage)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newImages = [...images]
      newImages.splice(draggedIndex, 1)
      newImages.splice(targetIndex, 0, dimg)
      setImages(newImages)
    }
  }

  const onOrderUpdateNow = async () => {
    setIsUpdating(true)
    try {
      await onOrderUpdate(images)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGroupImageDeleteClick = async (image: IImage) => {
    const confirmDelete = window.confirm(`"${image.name}" を削除しますか？`)
    if (confirmDelete) {
      await onImageDelete(image)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  useEffect(() => {
    setImages(imgs)
  }, [imgs])

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold mb-1">🖼️ 画像リスト管理</h4>
              <p className="text-muted mb-0">
                ドラッグ&ドロップで並び順を変更できます ({images.length}枚)
              </p>
            </div>
            {images.length > 0 && (
              <Button
                variant="primary"
                onClick={onOrderUpdateNow}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    更新中...
                  </>
                ) : (
                  <>💾 並び順を保存</>
                )}
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* 成功アラート */}
      {showSuccess && (
        <Alert variant="success" className="mb-4">
          ✅ 並び順を更新しました！
        </Alert>
      )}

      {/* 画像グリッド */}
      {images.length > 0 ? (
        <Row className="g-4">
          {images.map((image, index) => (
            <Col key={image.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                as="div"
                className="h-100 position-relative"
                draggable={true}
                onDragStart={(event) => handleDragStart(event, image)}
                onDragOver={(event) => handleDragOver(event)}
                onDrop={(event) => handleDrop(event, image)}
                style={{
                  cursor: 'grab',
                  transition: 'all 0.2s ease',
                }}
                onMouseDown={(e) => (e.currentTarget.style.cursor = 'grabbing')}
                onMouseUp={(e) => (e.currentTarget.style.cursor = 'grab')}
              >
                {/* 表示順バッジ */}
                <Badge
                  bg="primary"
                  className="position-absolute top-0 start-0 m-2"
                  style={{ zIndex: 10 }}
                >
                  #{image.displayNo}
                </Badge>

                {/* 削除ボタン */}
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  style={{ zIndex: 10, padding: '4px 8px' }}
                  onClick={() => handleGroupImageDeleteClick(image)}
                >
                  🗑️
                </Button>

                {/* 画像 */}
                <div
                  className="position-relative"
                  style={{
                    height: '200px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleOpenModal(index)}
                >
                  <img
                    src={image.path}
                    alt={image.name}
                    className="card-img-top"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  />
                </div>

                {/* カード情報 */}
                <Card.Body className="p-3">
                  <Card.Title className="h6 text-truncate mb-2">
                    {image.name}
                  </Card.Title>

                  <div className="d-flex justify-content-between align-items-center">
                    <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>
                      {formatFileSize(image.size)}
                    </Badge>
                    <small className="text-muted">
                      {image.createdAt &&
                        new Date(image.createdAt).toLocaleDateString('ja-JP')}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        /* 空の状態 */
        <Row>
          <Col className="text-center py-5">
            <div style={{ fontSize: '4rem' }}>🖼️</div>
            <h4 className="fw-bold mb-2">画像がありません</h4>
            <p className="text-muted mb-4">
              アップロードタブから画像を追加してください
            </p>
            <Button variant="primary" href="#upload">
              📤 画像をアップロード
            </Button>
          </Col>
        </Row>
      )}

      {/* 使用方法ヒント */}
      {images.length > 1 && (
        <Row className="mt-4">
          <Col>
            <Card className="bg-light">
              <Card.Body className="py-3">
                <small className="text-muted">
                  💡 <strong>使用方法:</strong>
                  画像をドラッグ&ドロップして並び順を変更し、「並び順を保存」ボタンで確定してください。
                  画像をクリックすると拡大表示されます。
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 画像プレビューモーダル */}
      {isModalOpen && (
        <ImagePreviewModal
          index={selectedIndex}
          onClose={handleCloseModal}
          images={images}
        />
      )}
    </Container>
  )
}

export default GroupImageList
