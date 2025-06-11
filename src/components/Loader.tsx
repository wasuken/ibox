import { Container, Spinner } from 'react-bootstrap'

const Loader = () => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
      }}
    >
      <Container className="text-center">
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: '4rem', height: '4rem' }}
        />
        <div className="mt-3">
          <h5>Loading...</h5>
          <small className="text-muted">Please wait a moment</small>
        </div>
      </Container>
    </div>
  )
}

export default Loader
