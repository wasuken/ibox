import { useState, useRef } from "react";
import styles from "@/styles/GroupImageUploader.module.css";
import Image from "next/image";
import GroupImageUploader from "@/components/GroupImageUploader";

interface UploadParam {
  onUpload: (
    file: File,
    displayNo: number,
    fileName: string
  ) => Promise<boolean[]>;
  doUpload: boolean;
  isMulti: boolean;
  onClose: () => boolean;
}

type Props = {
  onUpload: (params: UploadParam[]) => Promise<boolean[]>;
};

const initUploadParam = () => {
  return {
    onUpload: async (file: File, displayNo: number, filename: string) => [
      false,
      false,
    ],
    doUpload: false,
    isMulti: true,
    onClose: () => {},
  };
};

const GroupImageMultiUploader: React.FC<Props> = ({ onUpload }) => {
  const [gimages, setGImages] = useState<UploadParam[]>([initUploadParam()]);
  const handleAdd = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    setGImages([...gimages, initUploadParam()]);
  };
  return (
    <div>
      {gimages.map((gi, key) => (
        <GroupImageUploader
          key={key}
          onUpload={gi.onUpload}
          doUpload={gi.doUpload}
          isMulti={gi.isMulti}
          onClose={() => setGImages(gimages.filter((_x, kk) => key != kk))}
        />
      ))}
      <div>
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
};

export default GroupImageMultiUploader;
