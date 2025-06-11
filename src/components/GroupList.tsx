import { Group } from '@/types'
import NextImage from 'next/image'
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap'

interface Props {
  groupList: Group[]
}

export default function GroupList(props: Props) {
  const { groupList } = props

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">Gallery</h2>
              <p className="text-muted mb-0">
                {groupList.length} groups available
              </p>
            </div>
            <Button variant="primary" href="/group">
              + Create New Group
            </Button>
          </div>
        </Col>
      </Row>

      {groupList.length > 0 ? (
        <Row className="g-4">
          {groupList.map((group, i) => (
            <Col key={i} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 hover-scale">
                <a href={`/group/${group.id}`} className="text-decoration-none">
                  <div
                    className="position-relative"
                    style={{ height: '200px', overflow: 'hidden' }}
                  >
                    {group.images?.length > 0 ? (
                      <>
                        <NextImage
                          width={300}
                          height={200}
                          src={group.images[0].path}
                          alt={group.images[0].name}
                          className="card-img-top"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Badge
                          bg="dark"
                          className="position-absolute top-0 end-0 m-2"
                          style={{ fontSize: '0.7rem' }}
                        >
                          {group.images.length} photos
                        </Badge>
                      </>
                    ) : (
                      <div
                        className="card-img-top d-flex align-items-center justify-content-center bg-light"
                        style={{ height: '100%' }}
                      >
                        <span style={{ fontSize: '3rem' }}>📁</span>
                      </div>
                    )}
                  </div>

                  <Card.Body>
                    <Card.Title className="fw-bold text-truncate">
                      {group.name}
                    </Card.Title>

                    {group.tags && group.tags.length > 0 && (
                      <div className="mb-2">
                        {group.tags.slice(0, 2).map((tag, i) => (
                          <Badge
                            key={i}
                            bg="outline-primary"
                            className="me-1 tag-item"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {group.tags.length > 2 && (
                          <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>
                            +{group.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <small className="text-muted">
                      📅 {group.createdAt.toLocaleDateString('ja-JP')}
                    </small>
                  </Card.Body>
                </a>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col className="text-center py-5">
            <div style={{ fontSize: '4rem' }}>📂</div>
            <h4 className="fw-bold mb-2">No groups yet</h4>
            <p className="text-muted mb-4">
              Create your first group to get started
            </p>
            <Button variant="primary" size="lg" href="/group">
              + Create Your First Group
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  )
}
