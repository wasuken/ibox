import { Box, Heading, Flex, Tag, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Tag as TagType, SearchParams } from '@/types';

function generateHref(params: SearchParams) {
  if (!params.tag) params.tag = '';
  if (!params.query) params.query = '';
  if (!params.page) params.page = 0;
  const tagp = `tag=${params.tag}`;
  const queryp = `query=${params.query}`;
  const pagep = `page=${params.page}`;
  return `?${tagp}&${queryp}&${pagep}`;
}

interface Props {
  tagList: TagType[];
}

const initParams = () => {
  return {
    tag: '',
    query: '',
    page: 0,
  };
};

export default function TagList({ tagList }: Props) {
  return (
    <Box py={4} px={6}>
      <Heading as="h2" size="lg" mb={4}>
        タグ
      </Heading>
      <Flex flexWrap="wrap" gap={2}>
        {tagList.map((tag, i) => (
          <Link
            key={i}
            as={NextLink}
            href={generateHref({ ...initParams(), tag: tag.name })}
            _hover={{ textDecoration: 'none' }}
          >
            <Tag
              size="md"
              variant="solid"
              colorScheme="teal"
              borderRadius="full"
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
            >
              {tag.name}
            </Tag>
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
