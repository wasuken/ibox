import React from 'react';
import { render } from '@testing-library/react';
import ImagePreviewModal from '@/components/ImagePreviewModal';
import { Tag, Image, Group } from '@/types';

test('モーダルが表示されるか', () => {
  const images: Image[] = [
    {
      id: 1,
      name: 'hoge.png',
      path: '/uploads/1/test.png',
      size: 100,
      displayNo: 1,
      groupImageId: 1,
      createdAt: new Date(),
    },
  ];
  const onClose = () => {};
  const index = 0;
  const { getByAltText } = render(
    <ImagePreviewModal images={images} onClose={onClose} index={index} />
  );
  const groupTagElm = getByAltText(/hoge.png/i);
  expect(groupTagElm).toBeInTheDocument();
});
