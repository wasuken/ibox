import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Group, Image } from '@/types';
import { PrismaClient } from '@prisma/client';
import Layout from '@/components/Layout';

// Chakra UI imports
import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Flex,
  useToast,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Button,
  Icon,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

// Components
import GroupInfo from '@/components/GroupInfo';
import GroupImageList from '@/components/GroupImageList';
import GroupImageUploader from '@/components/GroupImageUploader';
import GroupImageMultiUploader from '@/components/GroupImageMultiUploader';
import GroupImageCrawler from '@/components/GroupImageCrawler';

const prisma = new PrismaClient();

type Props = {
  group: Group;
};

const emptyResponse = {
  props: {
    group: {},
  },
};

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const { id } = context.query;
  if (typeof id !== 'string') {
    return emptyResponse;
  }
  const group = await prisma.group.findFirst({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      title: true,
      description: true,
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
  });
  if (!group) return emptyResponse;
  const jgroup = {
    ...JSON.parse(JSON.stringify(group)),
    name: group.title,
    tags: group.groupTags.map(t => t.tag.name),
    images: group?.groupImages.map(gi => {
      return {
        ...gi.image,
        displayNo: gi.display_no,
        groupImageId: gi.id,
      };
    }),
  };
  return {
    props: {
      group: jgroup,
    },
  };
};

const GroupPage: NextPage<Props> = (props: Props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [group, setGroup] = useState<Group>(props.group);
  const [images, setImages] = useState<Image[]>(props.group.images || []);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // API操作関数
  const fetchGroup = async () => {
    const id = props.group.id;
    try {
      const res = await fetch(`/api/group/${id}`);
      if (!res.ok) throw new Error('Failed to fetch group');

      const resj = await res.json();
      setGroup(resj);
      setImages(resj.images || []);
      return true;
    } catch (e) {
      toast({
        title: 'グループデータの取得に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const postImage = async (imageFile: File, displayNo: number, fileName: string) => {
    try {
      const formData = new FormData();
      formData.set('image', imageFile);
      formData.set('name', fileName);
      formData.set('size', imageFile.size.toString());
      formData.set('displayNo', displayNo.toString());
      formData.set('groupId', group.id.toString());

      const res = await fetch(`/api/group/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload image');

      const ress = await fetchGroup();
      toast({
        title: '画像がアップロードされました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      return [true, ress];
    } catch (e) {
      toast({
        title: '画像のアップロードに失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return [false, false];
    }
  };

  const updateGroup = async (group: Group) => {
    try {
      const res = await fetch(`/api/group/${group.id}`, {
        method: 'PUT',
        body: JSON.stringify(group),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to update group');

      const ress = await fetchGroup();
      toast({
        title: 'グループ情報が更新されました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      return [res.ok, ress];
    } catch (e) {
      toast({
        title: 'グループ情報の更新に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return [false, false];
    }
  };

  const deleteGroup = async (groupId: number) => {
    try {
      const res = await fetch(`/api/group/${groupId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete group');

      toast({
        title: 'グループが削除されました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      return [res.ok, true];
    } catch (e) {
      toast({
        title: 'グループの削除に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return [false, false];
    }
  };

  const onOrderUpdate = async (iimages: Image[]) => {
    try {
      const idNoList = iimages.map((image, no) => [image.groupImageId, no]);
      const res = await fetch(`/api/group/image/order`, {
        method: 'PUT',
        body: JSON.stringify(idNoList),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to update image order');

      const ress = await fetchGroup();
      toast({
        title: '画像の表示順が更新されました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      return [res.ok, ress];
    } catch (e) {
      toast({
        title: '画像の表示順の更新に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return [false, false];
    }
  };

  const onImageDelete = async (img: Image) => {
    try {
      const res = await fetch(`/api/group/image/${img.groupImageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete image');

      const ress = await fetchGroup();
      toast({
        title: '画像が削除されました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      return [res.ok, ress];
    } catch (e) {
      toast({
        title: '画像の削除に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return [false, false];
    }
  };

  // タブアイテム定義
  const tabItems = [
    {
      label: 'グループ詳細',
      content: <GroupInfo group={group} onSave={updateGroup} onDelete={deleteGroup} />,
    },
    {
      label: '画像アップロード',
      content: <GroupImageMultiUploader onUpload={postImage} />,
    },
    {
      label: '画像リスト',
      content: (
        <GroupImageList
          images={images}
          onOrderUpdate={onOrderUpdate}
          onImageDelete={onImageDelete}
        />
      ),
    },
    {
      label: '画像クローラー',
      content: <GroupImageCrawler groupId={group.id} onUpdate={fetchGroup} />,
    },
  ];

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    if (isMobile) onClose();
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={4} px={{ base: 2, md: 4 }}>
        <Flex mb={6} align="center">
          <Heading as="h1" size="xl">
            {group.name}
          </Heading>

          {isMobile && (
            <Button
              ml="auto"
              onClick={onOpen}
              leftIcon={<Icon as={HamburgerIcon} />}
              colorScheme="blue"
              variant="outline"
              size="sm"
            >
              メニュー
            </Button>
          )}
        </Flex>

        {isMobile ? (
          // モバイル用ドロワーナビゲーション
          <>
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">メニュー</DrawerHeader>
                <DrawerBody>
                  <Flex direction="column" gap={2} mt={2}>
                    {tabItems.map((item, index) => (
                      <Button
                        key={index}
                        variant={tabIndex === index ? 'solid' : 'ghost'}
                        colorScheme={tabIndex === index ? 'blue' : 'gray'}
                        justifyContent="flex-start"
                        onClick={() => handleTabChange(index)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Flex>
                </DrawerBody>
              </DrawerContent>
            </Drawer>

            <Box mt={4}>{tabItems[tabIndex].content}</Box>
          </>
        ) : (
          // デスクトップ用タブナビゲーション
          <Tabs variant="enclosed" colorScheme="blue" index={tabIndex} onChange={setTabIndex}>
            <TabList>
              {tabItems.map((item, index) => (
                <Tab key={index}>{item.label}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {tabItems.map((item, index) => (
                <TabPanel key={index} pt={6}>
                  {item.content}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
      </Container>
    </Layout>
  );
};

export default GroupPage;
