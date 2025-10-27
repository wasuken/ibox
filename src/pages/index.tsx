import GroupList from '@/components/GroupList'
import Layout from '@/components/Layout'
import TagList from '@/components/TagList'
import { Group, Tag } from '@/types'
import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'

const SORT_OPTIONS = [
  { value: 'created_desc', label: '新しい順' },
  { value: 'created_asc', label: '古い順' },
  { value: 'views_desc', label: '閲覧数が多い順' },
  { value: 'views_asc', label: '閲覧数が少ない順' },
  { value: 'updated_desc', label: '最終更新が新しい順' },
  { value: 'updated_asc', label: '最終更新が古い順' },
  { value: 'name_asc', label: '名前順 (A → Z)' },
  { value: 'name_desc', label: '名前順 (Z → A)' },
]

export default function Home() {
  const [groupList, setGroupList] = useState<Group[]>([])
  const [tagList, setTagList] = useState<Tag[]>([])
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sortOption, setSortOption] = useState<string>('created_desc')

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchGroupSearch()
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value)
  }

  function fetchGroupList() {
    setIsLoading(true)
    const params = new URLSearchParams(location.search)
    params.set('sort', sortOption)
    const queryString = params.toString()
    fetch(`/api/groups${queryString ? `?${queryString}` : ''}`)
      .then((res) => res.json())
      .then((js) => {
        const jss = js.map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt),
          lastViewedAt: o.lastViewedAt ? new Date(o.lastViewedAt) : null,
          viewCount: o.viewCount ?? 0,
          tags: o.tags.map((x: Tag) => x.name),
        }))
        setGroupList(jss)
      })
      .finally(() => setIsLoading(false))
  }

  function fetchGroupSearch() {
    setIsLoading(true)
    const params = new URLSearchParams(location.search)
    if (searchText) {
      params.set('query', searchText)
    } else {
      params.delete('query')
    }
    params.set('sort', sortOption)
    const queryString = params.toString()
    fetch(`/api/groups${queryString ? `?${queryString}` : ''}`)
      .then((res) => res.json())
      .then((js) => {
        const jss = js.map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt),
          lastViewedAt: o.lastViewedAt ? new Date(o.lastViewedAt) : null,
          viewCount: o.viewCount ?? 0,
          tags: o.tags.map((x: Tag) => x.name),
        }))
        setGroupList(jss)
      })
      .finally(() => setIsLoading(false))
  }

  function fetchTagList() {
    fetch(`/api/tags`)
      .then((res) => res.json())
      .then((js) => {
        setTagList(js)
      })
  }

  useEffect(() => {
    fetchTagList()
  }, [])

  useEffect(() => {
    fetchGroupList()
  }, [sortOption])

  return (
    <Layout>
      <Container>
        <Row className="text-center py-5 mb-5">
          <Col>
            <h1 className="display-4 fw-bold mb-3">
              <span className="text-primary">iBox</span>
            </h1>
            <p className="lead text-muted mb-4">
              画像管理ツール
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center mb-5">
          <Col md={8} lg={6}>
            <Card>
              <Card.Body>
                <h5 className="card-title text-center mb-3">🔍 検索</h5>
                <Form onSubmit={handleSearchSubmit}>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={searchText}
                      onChange={handleSearchInputChange}
                      placeholder="グループを検索..."
                      className="flex-grow-1"
                    />
                    <Button type="submit" variant="primary">
                      検索
                    </Button>
                  </div>
                </Form>
                <Form.Group className="mt-3">
                  <Form.Label className="fw-bold text-muted small">
                    並び替え
                  </Form.Label>
                  <Form.Select
                    value={sortOption}
                    onChange={handleSortChange}
                    aria-label="ソート順を選択"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <TagList tagList={tagList} />

        {isLoading ? (
          <Row>
            <Col className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <h5>読み込み中...</h5>
              <p className="text-muted">少々お待ちください</p>
            </Col>
          </Row>
        ) : (
          <GroupList groupList={groupList} />
        )}
      </Container>
    </Layout>
  )
}
