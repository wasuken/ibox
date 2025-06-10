import React from 'react';
import { render } from '@testing-library/react';
import TagList from '@/components/TagList';
import { Tag } from '@/types';

test('タグ情報が表示されるか', () => {
  const tags: Tag[] = [
    {
      id: 1,
      name: 'tagtest',
    },
    {
      id: 2,
      name: 'toost',
    },
  ];
  const { getByText } = render(<TagList tagList={tags} />);

  const tagElm = getByText(/toost/i);
  expect(tagElm).toBeInTheDocument();
});
