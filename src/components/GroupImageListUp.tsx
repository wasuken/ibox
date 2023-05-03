import GroupImageList from "@/components/GroupImageList";
import GroupImageUploader from "@/components/GroupImageUploader";
import { Image as IImage } from "@/types";

interface Props {
  onUpload: (
    file: File,
    displayNo: number,
    fileName: string
  ) => Promise<boolean[]>;
  images: IImage[];
}

export default function GroupImageListUp(props: Props) {
  return (
    <>
      <GroupImageUploader onUpload={props.onUpload} />
      <hr />
      <GroupImageList images={props.images} />
    </>
  );
}
