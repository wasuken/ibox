import { useState, useEffect } from 'react';
import { Group, Tag } from '@/types';
import TagList from '@/components/TagList';
import GroupList from '@/components/GroupList';
import Layout from '@/components/Layout';
import { Box, Container, Heading, Input, Button, Flex, useToast } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export default function Home() {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [searchText, setSearchText] = useState('');
  const toast = useToast();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchGroupSearch();
  };

  function fetchGroupList() {
    fetch(`/api/groups${location.search}`)
      .then(res => res.json())
      .then(js => {
        const jss = js.map((o: any) => {
          return {
            ...o,
            createdAt: new Date(o.createdAt),
          };
        });
        setGroupList(jss);
      })
      .catch(error => {
        toast({
          title: 'データの取得に失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('Error fetching group list:', error);
      });
  }

  function fetchGroupSearch() {
    fetch(`/api/groups?query=${searchText}`)
      .then(res => res.json())
      .then(js => {
        const jss = js.map((o: any) => {
          return {
            ...o,
            createdAt: new Date(o.createdAt),
          };
        });
        setGroupList(jss);
        toast({
          title: `${jss.length}件のグループが見つかりました`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      })
      .catch(error => {
        toast({
          title: '検索に失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('Error searching groups:', error);
      });
  }

  function fetchTagList() {
    fetch(`/api/tags`)
      .then(res => res.json())
      .then(js => {
        setTagList(js);
      })
      .catch(error => {
        console.error('Error fetching tag list:', error);
      });
  }

  useEffect(() => {
    fetchTagList();
    fetchGroupList();
  }, []);

  return (
    <Layout>
      <Container maxW="container.xl" py={6}>
        <Box mb={6}>
          <Heading as="h2" size="lg" mb={4}>
            検索
          </Heading>
          <form onSubmit={handleSearchSubmit}>
            <Flex gap={4}>
              <Input
                type="text"
                value={searchText}
                onChange={handleSearchInputChange}
                placeholder="グループを検索..."
                size="md"
                borderRadius="md"
                flex="1"
              />
              <Button type="submit" colorScheme="blue" leftIcon={<SearchIcon />}>
                検索
              </Button>
            </Flex>
          </form>
        </Box>

        <TagList tagList={tagList} />
        <GroupList groupList={groupList} />
      </Container>
    </Layout>
  );
}
