import Head from "next/head";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>iBox</title>
        <meta name="description" content="Simple & Modern Gallery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* モダンナビゲーション */}
      <Navbar expand="lg" className="shadow-sm" fixed="top">
        <Container>
          <Navbar.Brand href="/" className="fw-bold">
            <span className="text-primary">i</span>Box
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Gallery</Nav.Link>
              <Nav.Link href="/group">Create Group</Nav.Link>
            </Nav>
            
            <Nav>
              <Button 
                variant="primary" 
                size="sm" 
                href="/group"
                className="d-flex align-items-center"
              >
                <i className="bi bi-plus-circle me-1"></i>
                New Group
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* メインコンテンツ */}
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <Container className="py-4">
          {children}
        </Container>
      </main>
      
      {/* フッター */}
      <footer className="bg-dark text-center py-3 mt-auto">
        <Container>
          <small className="text-muted">
            &copy; 2025 iBox. Simple & Modern Gallery.
          </small>
        </Container>
      </footer>
    </>
  );
}
