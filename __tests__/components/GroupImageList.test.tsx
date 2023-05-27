import React from "react";
import { render } from "@testing-library/react";
import GroupImageList from "@/components/GroupImageList";
import { Image } from "@/types";

test("画像が表示されるか", () => {
  const images: Image[] = [
    {
      id: 1,
      name: "hoge.png",
      path: "/uploads/1/test.png",
      size: 100,
      displayNo: 1,
      groupImageId: 1,
      createdAt: new Date(),
    },
  ];
  const onOrderUpdate = async (_imgs: Image[]) => {
    return [true];
  };
  const onImageDelete = async (_img: Image) => {
    return [true];
  };
  const { getByText, getByAltText } = render(
    <GroupImageList
      images={images}
      onOrderUpdate={onOrderUpdate}
      onImageDelete={onImageDelete}
    />
  );
  const btnElm = getByText(/現在の並びで表示番号を更新する/i);
  expect(btnElm).toBeInTheDocument();
  const imageElm = getByAltText(/Group Image 1/i);
  expect(imageElm).toBeInTheDocument();
});
