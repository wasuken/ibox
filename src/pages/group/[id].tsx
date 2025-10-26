import Layout from '@/components/Layout'
import { Group, Image } from '@/types'
import { PrismaClient } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'

import GroupImageCrawler from '@/components/GroupImageCrawler'
import GroupImageList from '@/components/GroupImageList'
import GroupImageMultiUploader from '@/components/GroupImageMultiUploader'
import GroupImageUploader from '@/components/GroupImageUploader'
import GroupInfo from '@/components/GroupInfo'

import { useState } from 'react'
import { Col, Container, Nav, Row, Tab } from 'react-bootstrap'

const prisma = new PrismaClient()

type Props = {
  group: Group
}

const emptyResponse = {
  props: {
    group: {},
  },
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { id } = context.query
  if (typeof id !== 'string') {
    return emptyResponse
  }
  const group = await prisma.group.findFirst({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      groupTags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      groupImages: {
        select: {
          id: true,
          image: {
            select: {
              id: true,
              path: true,
              name: true,
              size: true,
            },
          },
          display_no: true,
        },
        orderBy: {
          display_no: 'asc',
        },
      },
    },
  })
  if (!group) return emptyResponse
  const jgroup = {
    ...JSON.parse(JSON.stringify(group)),
    name: group.title,
    tags: group.groupTags.map((t) => t.tag.name),
    images: group?.groupImages.map((gi) => {
      return {
        ...gi.image,
        displayNo: gi.display_no,
        groupImageId: gi.id,
      }
    }),
  }
  return {
    props: {
      group: jgroup,
    },
  }
}

const GroupPage: NextPage<Props> = (props: Props) => {
  const [group, setGroup] = useState<Group>(props.group)
  const [images, setImages] = useState<Image[]>(props.group.images)

  const fetchGroup = async () => {
    const id = props.group.id
    try {
      const res = await fetch(`/api/group/${id}`)
      const resj = await res.json()
      setGroup(resj)
      setImages(resj.images)
      return true
    } catch (e) {
      return false
    }
  }

  const postImage = async (
    imageFile: File,
    displayNo: number,
    fileName: string,
  ) => {
    const formData = new FormData()
    formData.set('image', imageFile)
    formData.set('name', fileName)
    formData.set('size', imageFile.size.toString())
    formData.set('displayNo', displayNo.toString())
    formData.set('groupId', group.id.toString())
    const res = await fetch(`/api/group/image`, {
      method: 'POST',
      body: formData,
    })
    const ress = await fetchGroup()
    return [res.ok, ress]
  }

  const updateGroup = async (group: Group) => {
    const res = await fetch(`/api/group/${group.id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const ress = await fetchGroup()
    return [res.ok, ress]
  }

  const deleteGroup = async (groupId: number) => {
    const res = await fetch(`/api/group/${groupId}`, {
      method: 'DELETE',
    })
    const ress = await fetchGroup()
    return [res.ok, ress]
  }

  const onOrderUpdate = async (iimages: Image[]) => {
    const idNoList = iimages.map((image, no) => [image.groupImageId, no])
    const res = await fetch(`/api/group/image/order`, {
      method: 'PUT',
      body: JSON.stringify(idNoList),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const ress = await fetchGroup()
    return [res.ok, ress]
  }

  const onImageDelete = async (img: Image) => {
    const res = await fetch(`/api/group/image/${img.groupImageId}`, {
      method: 'DELETE',
    })
    const ress = await fetchGroup()
    return [res.ok, ress]
  }

  return (
    <Layout>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h1 className="fw-bold">{props.group.name}</h1>
            <p className="text-muted">グループ管理ダッシュボード</p>
          </Col>
        </Row>

        <Tab.Container defaultActiveKey="info">
          <Row>
            <Col>
              {/* タブナビゲーション */}
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="info">⚙️ グループ詳細</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="upload">📤 アップロード</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="images">
                    🖼️ 画像リスト ({images.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="crawler">🕷️ クローラーツール</Nav.Link>
                </Nav.Item>
              </Nav>

              {/* タブコンテンツ */}
              <Tab.Content>
                {/* グループ詳細タブ */}
                <Tab.Pane eventKey="info">
                  <GroupInfo
                    group={group}
                    onSave={updateGroup}
                    onDelete={deleteGroup}
                  />
                </Tab.Pane>

                {/* アップロードタブ */}
                <Tab.Pane eventKey="upload">
                  <Row>
                    <Col lg={6} className="mb-4">
                      <h4 className="fw-bold mb-3">📤 単体アップロード</h4>
                      <GroupImageUploader onUpload={postImage} />
                    </Col>
                    <Col lg={6}>
                      <h4 className="fw-bold mb-3">📦 一括アップロード</h4>
                      <GroupImageMultiUploader onUpload={postImage} />
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* 画像リストタブ */}
                <Tab.Pane eventKey="images">
                  <GroupImageList
                    images={images}
                    onOrderUpdate={onOrderUpdate}
                    onImageDelete={onImageDelete}
                  />
                </Tab.Pane>

                {/* クローラーツールタブ */}
                <Tab.Pane eventKey="crawler">
                  <GroupImageCrawler groupId={group.id} onUpdate={fetchGroup} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Layout>
  )
}

export default GroupPage
