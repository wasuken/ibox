import { SearchParams, Tag } from '@/types'
import { Badge, Col, Container, Row } from 'react-bootstrap'

function generateHref(params: SearchParams) {
  if (!params.tag) params.tag = ''
  if (!params.query) params.query = ''
  if (!params.page) params.page = 0
  const tagp = `tag=${params.tag}`
  const queryp = `query=${params.query}`
  const pagep = `page=${params.page}`
  return `?${tagp}&${queryp}&${pagep}`
}

interface Props {
  tagList: Tag[]
}

const initParams = () => {
  return {
    tag: '',
    query: '',
    page: 0,
  }
}

export default function TagList(props: Props) {
  const { tagList } = props

  if (tagList.length === 0) {
    return null
  }

  return (
    <Container className="mb-5">
      <Row>
        <Col>
          <h4 className="fw-bold mb-3">🏷️ Browse by Tags</h4>
          <div className="d-flex flex-wrap gap-2">
            {tagList.map((tag, i) => (
              <Badge
                key={i}
                as="a"
                href={generateHref({ ...initParams(), tag: tag.name })}
                className="tag-item text-decoration-none p-2"
                style={{ fontSize: '0.9rem' }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  )
}
