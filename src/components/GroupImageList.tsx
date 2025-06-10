import { useState, useEffect } from 'react';
import { Image as IImage } from '@/types';
import {
  Box,
  SimpleGrid,
  Button,
  Text,
  Image,
  Badge,
  Flex,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Center,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { DeleteIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import NextImage from 'next/image';

type Props = {
  images: IImage[];
  onOrderUpdate: (imgs: IImage[]) => Promise<boolean[]>;
  onImageDelete: (img: IImage) => Promise<boolean[]>;
};

const GroupImageList: React.FC<Props> = ({
  images: initialImages,
  onOrderUpdate,
  onImageDelete,
}) => {
  const [draggedImage, setDraggedImage] = useState<IImage | null>(null);
  const [images, setImages] = useState<IImage[]>(initialImages);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // 画像プレビューモーダル用のステート
  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    onOpen();
  };

  // ドラッグ&ドロップ機能
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, image: IImage) => {
    setDraggedImage(image);
    setIsDragging(true);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // ドロップ可能な要素としてマーク
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    return false;
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetImage: IImage) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (!draggedImage) return;

    const dimg = draggedImage;
    const draggedIndex = images.findIndex(img => img.id === dimg.id);
    const targetIndex = images.findIndex(img => img.id === targetImage.id);

    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      const newImages = [...images];
      newImages.splice(draggedIndex, 1);
      newImages.splice(targetIndex, 0, dimg);
      setImages(newImages);
      setOrderChanged(true);
    }

    setDraggedImage(null);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedImage(null);
  };

  // 表示順更新
  const handleOrderUpdate = async () => {
    try {
      await onOrderUpdate(images);
      setOrderChanged(false);
      toast({
        title: '表示順を更新しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '表示順の更新に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 画像削除
  const handleImageDelete = async (image: IImage) => {
    try {
      await onImageDelete(image);
      toast({
        title: '画像を削除しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '画像の削除に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // モーダル内の前後ナビゲーション
  const handlePrevImage = () => {
    setSelectedIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setSelectedIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // キーボードナビゲーション
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevImage();
    } else if (e.key === 'ArrowRight') {
      handleNextImage();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // 親コンポーネントから新しい画像が渡されたら更新
  useEffect(() => {
    setImages(initialImages);
    setOrderChanged(false);
  }, [initialImages]);

  return (
    <Box maxW="1200px" mx="auto">
      {images.length > 0 ? (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading as="h3" size="md">
              画像一覧 ({images.length}枚)
            </Heading>
            <Button
              colorScheme="blue"
              onClick={handleOrderUpdate}
              isDisabled={!orderChanged}
              size="sm"
            >
              表示順を更新
            </Button>
          </Flex>

          <Text mb={4} fontSize="sm" color="gray.600">
            画像をドラッグ&ドロップして並び替えることができます。
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {images.map((image, index) => (
              <Box
                key={image.id}
                position="relative"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                boxShadow="sm"
                draggable
                onDragStart={e => handleDragStart(e, image)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, image)}
                onDragEnd={handleDragEnd}
                opacity={draggedImage?.id === image.id ? 0.5 : 1}
                cursor="grab"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
              >
                <Box position="absolute" top={2} left={2} zIndex={2}>
                  <Badge colorScheme="blue" borderRadius="full" px={2} py={1}>
                    {image.displayNo}
                  </Badge>
                </Box>

                <IconButton
                  aria-label="画像を削除"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  position="absolute"
                  top={2}
                  right={2}
                  zIndex={2}
                  onClick={() => handleImageDelete(image)}
                />

                <Box
                  onClick={() => handleImageClick(index)}
                  height="200px"
                  width="100%"
                  position="relative"
                  cursor="pointer"
                >
                  <Box
                    as="img"
                    src={image.path}
                    alt={image.name || `画像 ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              </Box>
            ))}
          </SimpleGrid>

          {/* 画像プレビューモーダル */}
          <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                画像プレビュー {selectedIndex + 1} / {images.length}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6} onKeyDown={handleKeyDown}>
                <Flex position="relative" direction="column" align="center">
                  <Box position="relative" width="100%" height="70vh" maxH="600px">
                    {images[selectedIndex] && (
                      <Box
                        as="img"
                        src={images[selectedIndex].path}
                        alt={images[selectedIndex].name || `画像 ${selectedIndex + 1}`}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </Box>

                  <Flex justify="space-between" w="100%" mt={4}>
                    <IconButton
                      aria-label="前の画像"
                      icon={<ArrowLeftIcon />}
                      onClick={handlePrevImage}
                      colorScheme="blue"
                    />
                    <IconButton
                      aria-label="次の画像"
                      icon={<ArrowRightIcon />}
                      onClick={handleNextImage}
                      colorScheme="blue"
                    />
                  </Flex>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Center py={10}>
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">
              まだ画像がありません
            </Text>
            <Text fontSize="sm" color="gray.400">
              「画像アップロード」タブから画像をアップロードしてください
            </Text>
          </VStack>
        </Center>
      )}
    </Box>
  );
};

export default GroupImageList;
