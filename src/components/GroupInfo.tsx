import { useState } from 'react';
import { Group } from '@/types';
import { useRouter } from 'next/router';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Flex,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import React from 'react';

type Props = {
  group: Group;
  onSave: (group: Group) => Promise<boolean[]>;
  onDelete: (groupId: number) => Promise<boolean[]>;
};

const GroupInfo: React.FC<Props> = ({ group, onSave, onDelete }) => {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [tags, setTags] = useState<string[]>(group.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: 'グループ名は必須です',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        ...group,
        name,
        title: name,
        description,
        tags,
      });
      setIsEditing(false);
      toast({
        title: 'グループ情報を保存しました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '保存に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const [success] = await onDelete(group.id);
      if (success) {
        toast({
          title: 'グループを削除しました',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        router.push('/');
      } else {
        throw new Error('削除に失敗しました');
      }
    } catch (error) {
      toast({
        title: '削除に失敗しました',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // 編集モードを終了する前に変更をリセット
      setName(group.name);
      setDescription(group.description);
      setTags(group.tags ?? []);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Box width="100%" maxW="800px" mx="auto">
      <Flex justify="flex-end" mb={4}>
        <Button
          leftIcon={isEditing ? <DeleteIcon /> : <EditIcon />}
          colorScheme={isEditing ? 'red' : 'blue'}
          variant="outline"
          onClick={handleToggleEdit}
          size="sm"
        >
          {isEditing ? '編集をキャンセル' : '編集'}
        </Button>
      </Flex>

      <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel fontWeight="bold">グループ名</FormLabel>
          {isEditing ? (
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="グループ名を入力"
              isRequired
            />
          ) : (
            <Box p={2} borderWidth="1px" borderRadius="md" bg="gray.50">
              {name}
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">説明</FormLabel>
          {isEditing ? (
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="グループの説明を入力"
              rows={5}
            />
          ) : (
            <Box p={2} borderWidth="1px" borderRadius="md" bg="gray.50" minH="100px">
              {description || '説明なし'}
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">タグ</FormLabel>
          {isEditing ? (
            <>
              <InputGroup>
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="タグを入力して Enter キーで追加"
                />
                <InputRightElement>
                  <Button h="1.75rem" size="sm" onClick={handleAddTag} disabled={!tagInput.trim()}>
                    <AddIcon />
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Flex wrap="wrap" mt={2} gap={2}>
                {tags.map((tag, index) => (
                  <Tag key={index} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                  </Tag>
                ))}
              </Flex>
            </>
          ) : (
            <Flex wrap="wrap" gap={2}>
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <Tag
                    key={index}
                    size="md"
                    borderRadius="full"
                    variant="subtle"
                    colorScheme="blue"
                  >
                    <TagLabel>{tag}</TagLabel>
                  </Tag>
                ))
              ) : (
                <Box p={2} color="gray.500">
                  タグなし
                </Box>
              )}
            </Flex>
          )}
        </FormControl>

        {isEditing && (
          <HStack spacing={4} justify="space-between" mt={4}>
            <Button
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              onClick={onOpen}
              isLoading={isLoading}
              variant="outline"
            >
              グループを削除
            </Button>

            <Button colorScheme="blue" onClick={handleSave} isLoading={isLoading}>
              保存
            </Button>
          </HStack>
        )}
      </VStack>

      {/* 削除確認ダイアログ */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              グループの削除
            </AlertDialogHeader>

            <AlertDialogBody>
              本当にこのグループを削除しますか？この操作は取り消せません。
              グループに関連するすべての画像も削除されます。
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isLoading}>
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default GroupInfo;
