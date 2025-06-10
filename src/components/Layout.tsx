import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Flex,
  Heading,
  Link,
  Container,
  Button,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>iBox</title>
        <meta name="description" content="画像管理アプリケーション" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box as="header" bg="gray.800" color="white" py={3} shadow="md">
        <Container maxW="container.xl">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
                <Heading as="h1" size="lg">
                  iBox
                </Heading>
              </Link>
            </Flex>

            <Flex alignItems="center" gap={4}>
              <Button
                as={NextLink}
                href="/group"
                size="sm"
                colorScheme="teal"
                leftIcon={<AddIcon />}
              >
                グループ作成
              </Button>

              <IconButton
                aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                size="sm"
              />
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Box as="main" minH="calc(100vh - 70px)">
        {children}
      </Box>
    </>
  );
}
