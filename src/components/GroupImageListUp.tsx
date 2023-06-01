import GroupImageList from "@/components/GroupImageList";
import GroupImageUploader from "@/components/GroupImageUploader";
import GroupImageMultiUploader from "@/components/GroupImageMultiUploader";
import { Image as IImage } from "@/types";

interface Props {
  onUpload: (
    file: File,
    displayNo: number,
    fileName: string
  ) => Promise<boolean[]>;
  images: IImage[];
  onOrderUpdate: (imgs: IImage[]) => Promise<boolean[]>;
  onImageDelete: (imgs: IImage) => Promise<boolean[]>;
}

export default function GroupImageListUp(props: Props) {
  return (
    <>
      <GroupImageMultiUploader onUpload={props.onUpload} />
      <GroupImageList
        images={props.images}
        onOrderUpdate={props.onOrderUpdate}
        onImageDelete={props.onImageDelete}
      />
    </>
  );
}
