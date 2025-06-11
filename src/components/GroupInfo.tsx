import { Group } from '@/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'

type Props = {
  group: Group
  onSave: (group: Group) => Promise<boolean[]>
  onDelete: (groupId: number) => Promise<boolean[]>
}

const GroupInfo: React.FC<Props> = ({ group, onSave, onDelete }) => {
  const [name, setName] = useState(group.name)
  const [description, setDescription] = useState(group.description)
  const [tags, setTags] = useState<string[]>(group.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave({ ...group, name, description, tags })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm(
      '本当に削除しますか？画像とか全部消えますよ？',
    )
    if (confirm) {
      setIsLoading(true)
      try {
        await onDelete(group.id)
        alert('削除を完了しました')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Container fluid className="py-4">
      <Row>
        {/* 左側: フォーム */}
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">📝 Edit Group Information</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {showSuccess && (
                <Alert variant="success" className="mb-4">
                  ✅ 保存成功
                </Alert>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold mb-2">Group Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter group name"
                      size="lg"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold mb-2">
                      Created Date
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        group.createdAt
                          ? new Date(group.createdAt).toLocaleDateString(
                              'ja-JP',
                            )
                          : 'Unknown'
                      }
                      disabled
                      size="lg"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold mb-2">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your group..."
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold mb-2">
                  Tags Management
                </Form.Label>
                <div className="d-flex gap-2 mb-3">
                  <Form.Control
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add new tag..."
                  />
                  <Button
                    variant="outline-primary"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                  >
                    + Add Tag
                  </Button>
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* 右側: プレビュー・アクション */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: '90px' }}>
            {/* タグプレビュー */}
            <Card className="mb-3">
              <Card.Header>
                <h5 className="mb-0">🏷️ Tag ({tags.length})</h5>
              </Card.Header>
              <Card.Body>
                {tags.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        bg="primary"
                        className="p-2"
                        style={{
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ✕
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">
                    タグがない. タグを追加してください!
                  </p>
                )}
              </Card.Body>
            </Card>

            {/* グループ統計 */}
            <Card className="mb-3">
              <Card.Header>
                <h5 className="mb-0">📊 グループ統計情報</h5>
              </Card.Header>
              <Card.Body>
                <div className="row text-center">
                  <div className="col-6">
                    <h4 className="text-primary mb-0">
                      {group.images?.length || 0}
                    </h4>
                    <small className="text-muted">Images</small>
                  </div>
                  <div className="col-6">
                    <h4 className="text-success mb-0">{tags.length}</h4>
                    <small className="text-muted">Tags</small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* アクションボタン */}
            <Card>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      <>💾 保存する</>
                    )}
                  </Button>

                  <hr />

                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    🗑️ このグループを削除する
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default GroupInfo
