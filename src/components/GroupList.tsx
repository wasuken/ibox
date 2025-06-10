import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Flex,
  Link,
  Badge,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { Group } from '@/types';

interface Props {
  groupList: Group[];
}

export default function GroupList({ groupList }: Props) {
  return (
    <Box py={4} px={6}>
      <Heading as="h2" size="lg" mb={4}>
        グループ
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {groupList.map(group => (
          <LinkBox
            key={group.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            _hover={{
              shadow: 'md',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Box position="relative" height="200px">
              {group.images?.length > 0 ? (
                <Box
                  as="img"
                  src={group.images[0].path}
                  alt={group.images[0].name || 'グループ画像'}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              ) : (
                <Flex height="100%" bg="gray.200" alignItems="center" justifyContent="center">
                  <Text color="gray.500">No Image</Text>
                </Flex>
              )}
            </Box>

            <Box p={4}>
              <Heading as="h3" size="md" mb={2}>
                <LinkOverlay as={NextLink} href={`/group/${group.id}`}>
                  {group.name}
                </LinkOverlay>
              </Heading>

              {group.tags && group.tags.length > 0 && (
                <Flex gap={2} flexWrap="wrap" mb={2}>
                  {group.tags.map((tag, i) => (
                    <Link key={i} as={NextLink} href={`/?tag=${tag.name}&page=0&query=`}>
                      <Badge colorScheme="blue">{tag.name}</Badge>
                    </Link>
                  ))}
                </Flex>
              )}

              <Text fontSize="sm" color="gray.500">
                {new Date(group.createdAt).toLocaleString()}
              </Text>
            </Box>
          </LinkBox>
        ))}
      </SimpleGrid>
    </Box>
  );
}
