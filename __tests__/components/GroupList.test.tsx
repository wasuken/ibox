import React from 'react';
import { render } from '@testing-library/react';
import GroupList from '@/components/GroupList';
import { Tag, Image, Group } from '@/types';

test('グループが表示されるか', () => {
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
  const tags: Tag[] = [
    {
      id: 1,
      name: 'tagtest',
    },
  ];
  const dt = new Date();
  const groups: Group[] = [
    {
      id: 1,
      name: 'GroupListテスト',
      description: 'test description',
      tags,
      images,
      createdAt: dt,
    },
  ];
  const { getByText } = render(<GroupList groupList={groups} />);
  const groupTagElm = getByText(/tagtest/i);
  expect(groupTagElm).toBeInTheDocument();

  const groupElm = getByText(/GroupListテスト/i);
  expect(groupElm).toBeInTheDocument();
});
