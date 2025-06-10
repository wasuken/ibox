import React from 'react';
import { render } from '@testing-library/react';
import GroupImageUploader from '@/components/GroupImageUploader';
import { Tag, Image, Group } from '@/types';

test('アップローダが表示されるか', () => {
  const onUpload = async (file: File, displayNo: number, filename: string) => {
    return [true, true];
  };
  const { getByText } = render(<GroupImageUploader onUpload={onUpload} />);
  const uploaderElm = getByText(/ファイル名/i);
  expect(uploaderElm).toBeInTheDocument();
});
