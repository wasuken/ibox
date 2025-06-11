import { useState, useEffect } from "react";
import { Group, Tag } from "@/types";
import TagList from "@/components/TagList";
import GroupList from "@/components/GroupList";
import Layout from "@/components/Layout";
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';

export default function Home() {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchGroupSearch();
  };

  function fetchGroupList() {
    setIsLoading(true);
    fetch(`/api/groups${location.search}`)
      .then((res) => res.json())
      .then((js) => {
        const jss = js.map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt),
        }));
        setGroupList(jss);
      })
      .finally(() => setIsLoading(false));
  }

  function fetchGroupSearch() {
    setIsLoading(true);
    fetch(`/api/groups?query=${searchText}`)
      .then((res) => res.json())
      .then((js) => {
        const jss = js.map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt),
        }));
        setGroupList(jss);
      })
      .finally(() => setIsLoading(false));
  }

  function fetchTagList() {
    fetch(`/api/tags`)
      .then((res) => res.json())
      .then((js) => {
        setTagList(js);
      });
  }

  useEffect(() => {
    fetchTagList();
    fetchGroupList();
  }, []);

  return (
    <Layout>
      <Container>
        {/* ヒーローセクション */}
        <Row className="text-center py-5 mb-5">
          <Col>
            <h1 className="display-4 fw-bold mb-3">
              Welcome to <span className="text-primary">iBox</span>
            </h1>
            <p className="lead text-muted mb-4">
              Simple & Modern Gallery for your image collections
            </p>
          </Col>
        </Row>

        {/* 検索セクション */}
        <Row className="justify-content-center mb-5">
          <Col md={8} lg={6}>
            <Card>
              <Card.Body>
                <h5 className="card-title text-center mb-3">
                  <i className="bi bi-search me-2"></i>
                  Search Gallery
                </h5>
                <Form onSubmit={handleSearchSubmit}>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={searchText}
                      onChange={handleSearchInputChange}
                      placeholder="Search groups..."
                      className="flex-grow-1"
                    />
                    <Button type="submit" variant="primary">
                      <i className="bi bi-search"></i>
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* タグセクション */}
        <TagList tagList={tagList} />

        {/* ローディング / グループリスト */}
        {isLoading ? (
          <Row>
            <Col className="text-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <h5>Loading gallery...</h5>
              <p className="text-muted">Please wait a moment</p>
            </Col>
          </Row>
        ) : (
          <GroupList groupList={groupList} />
        )}
      </Container>
    </Layout>
  );
}
