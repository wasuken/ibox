import React from "react";
import { render } from "@testing-library/react";
import GroupInfo from "@/components/GroupInfo";
import { Tag, Image, Group } from "@/types";

test("グループ詳細が表示されるか", () => {
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
  const tags: Tag[] = [
    {
      id: 1,
      name: "taginfotest",
    },
  ];
  const dt = new Date();
  const group: Group = {
    id: 1,
    name: "GroupInfoテスト",
    description: "test info description",
    tags,
    images,
    createdAt: dt,
  };
  const onSave = async (group: Group) => {
    return true;
  };
  const { getByRole } = render(<GroupInfo group={group} onSave={onSave} />);
  const groupTagElm = getByRole("textbox", { name: /name/i });
  expect(groupTagElm).toBeInTheDocument();
});
