import Loader from '@/components/Loader'
import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from 'react-bootstrap'

interface Props {
  groupId: number
  onUpdate: () => Promise<boolean>
}

interface CrawlHistory {
  url: string
  css: string
  timestamp: number
  resultCount: number
}

export default function GroupImageCrawler(props: Props) {
  const groupId = props.groupId
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [url, setURL] = useState<string>('')
  const [css, setCSS] = useState<string>('')
  const [resultList, setResultList] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [crawlHistory, setCrawlHistory] = useState<CrawlHistory[]>([])

  // 履歴の読み込み
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('crawl_history')
      if (saved) {
        const history = JSON.parse(saved)
        // 最新順にソート、最大10件
        setCrawlHistory(
          history
            .sort(
              (a: CrawlHistory, b: CrawlHistory) => b.timestamp - a.timestamp,
            )
            .slice(0, 10),
        )
      }
    } catch (error) {
      console.error('履歴の読み込みに失敗:', error)
    }
  }

  const saveToHistory = (url: string, css: string, resultCount: number) => {
    try {
      const newEntry: CrawlHistory = {
        url,
        css,
        timestamp: Date.now(),
        resultCount,
      }

      const existing = crawlHistory.filter(
        (h) => !(h.url === url && h.css === css),
      )
      const updated = [newEntry, ...existing].slice(0, 10)

      localStorage.setItem('crawl_history', JSON.stringify(updated))
      setCrawlHistory(updated)
    } catch (error) {
      console.error('履歴の保存に失敗:', error)
    }
  }

  const loadFromHistory = (historyItem: CrawlHistory) => {
    setURL(historyItem.url)
    setCSS(historyItem.css)
    setResultList([])
  }

  const clearHistory = () => {
    localStorage.removeItem('crawl_history')
    setCrawlHistory([])
  }

  const handleClickPostImageList = async () => {
    if (resultList.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/group/uploader`, {
        method: 'POST',
        body: JSON.stringify({
          groupId,
          resultList,
        }),
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        props.onUpdate()
        setResultList([])
      } else {
        setShowError(true)
        setErrorMessage('アップロードに失敗しました')
        setTimeout(() => setShowError(false), 3000)
      }
    } catch (error) {
      setShowError(true)
      setErrorMessage('ネットワークエラーが発生しました')
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchResult = async () => {
    if (!url.trim() || !css.trim()) {
      setShowError(true)
      setErrorMessage('URLとCSSセレクタを入力してください')
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setIsLoading(true)
    setResultList([])

    try {
      const response = await fetch(
        `/api/crawler?url=${encodeURIComponent(url)}&css=${encodeURIComponent(css)}`,
      )

      if (response.ok) {
        const resj = await response.json()
        setResultList(resj.result || [])

        // 履歴に保存
        if (resj.result && resj.result.length > 0) {
          saveToHistory(url, css, resj.result.length)
        }
      } else {
        setShowError(true)
        setErrorMessage('クロール処理に失敗しました')
        setTimeout(() => setShowError(false), 3000)
      }
    } catch (error) {
      setShowError(true)
      setErrorMessage('APIエラーが発生しました')
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (i: number) => {
    const newList = [...resultList]
    newList.splice(i, 1)
    setResultList(newList)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ja-JP')
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h4 className="fw-bold mb-1">🕷️ ウェブクローラーツール</h4>
          <p className="text-muted mb-0">
            ウェブサイトから画像を自動収集してグループに追加
          </p>
        </Col>
      </Row>

      {/* アラート */}
      {showSuccess && (
        <Alert variant="success" className="mb-4">
          ✅ 画像のアップロードが完了しました！
        </Alert>
      )}
      {showError && (
        <Alert variant="danger" className="mb-4">
          ❌ {errorMessage}
        </Alert>
      )}

      <Row>
        {/* メインフォーム */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">クロール設定</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">対象URL</Form.Label>
                <Form.Control
                  type="url"
                  value={url}
                  onChange={(e) => setURL(e.target.value)}
                  placeholder="https://example.com"
                />
                <Form.Text className="text-muted">
                  画像を取得したいウェブページのURL
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">CSSセレクタ</Form.Label>
                <Form.Control
                  type="text"
                  value={css}
                  onChange={(e) => setCSS(e.target.value)}
                  placeholder="img.photo, .gallery img"
                />
                <Form.Text className="text-muted">
                  取得したい画像のCSSセレクタ（例: img, .gallery img, #content
                  img）
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={fetchResult}
                  disabled={!url.trim() || !css.trim()}
                >
                  🔍 画像を検索
                </Button>
                {resultList.length > 0 && (
                  <Button variant="success" onClick={handleClickPostImageList}>
                    📤 {resultList.length}枚をアップロード
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* 検索結果 */}
          {resultList.length > 0 && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">検索結果</h5>
                <Badge bg="primary">{resultList.length}枚見つかりました</Badge>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  {resultList.map((imageUrl, index) => (
                    <Col key={index} xs={6} md={4} lg={3}>
                      <Card className="position-relative">
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-1"
                          onClick={() => handleDeleteClick(index)}
                          style={{ zIndex: 10, padding: '4px 8px' }}
                        >
                          ✕
                        </Button>
                        <img
                          src={imageUrl}
                          alt={`検索結果 ${index + 1}`}
                          className="card-img-top"
                          style={{
                            height: '150px',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <Card.Body className="p-2">
                          <small className="text-muted text-truncate d-block">
                            {imageUrl.split('/').pop()}
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* 履歴サイドバー */}
        <Col lg={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📜 クロール履歴</h5>
              {crawlHistory.length > 0 && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={clearHistory}
                >
                  クリア
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              {crawlHistory.length > 0 ? (
                <ListGroup variant="flush">
                  {crawlHistory.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      action
                      onClick={() => loadFromHistory(item)}
                      className="cursor-pointer"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div
                            className="fw-bold text-truncate"
                            style={{ maxWidth: '200px' }}
                          >
                            {item.url}
                          </div>
                          <small className="text-muted d-block">
                            {item.css}
                          </small>
                          <small className="text-muted">
                            {formatDate(item.timestamp)}
                          </small>
                        </div>
                        <Badge bg="secondary" className="ms-2">
                          {item.resultCount}枚
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="p-3 text-center text-muted">
                  <div style={{ fontSize: '2rem' }}>📭</div>
                  <p className="mb-0">履歴がありません</p>
                  <small>クロールを実行すると履歴が保存されます</small>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* 使用方法 */}
          <Card className="mt-3">
            <Card.Header>
              <h6 className="mb-0">💡 使用方法</h6>
            </Card.Header>
            <Card.Body>
              <small className="text-muted">
                <ol className="ps-3 mb-0">
                  <li>対象サイトのURLを入力</li>
                  <li>画像のCSSセレクタを指定</li>
                  <li>「画像を検索」で取得</li>
                  <li>不要な画像を削除</li>
                  <li>「アップロード」で保存</li>
                </ol>
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
