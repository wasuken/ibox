import { useState } from "react";
import styles from "@/styles/GroupInfo.module.css";
import { Group } from "@types";

type Props = {
  group: Group;
  onSave: (group: Group) => void;
};

const GroupInfo: React.FC<Props> = ({ group, onSave }) => {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [tags, setTags] = useState<string[]>(group.tags ?? []);
  console.log(group);

  const handleSave = () => {
    onSave({ ...group, name, description, tags });
  };

  return (
    <div className={styles.container}>
      <h2>Group Info</h2>
      <label htmlFor="name">
        Name:
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </label>
      <label htmlFor="description">
        Description:
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />
      </label>
      <label htmlFor="tags">
        Tags:
        <input
          type="text"
          id="tags"
          name="tags"
          value={tags.join(",")}
          onChange={(e) => setTags(e.target.value.split(","))}
          className={styles.input}
        />
      </label>
      <div className={styles.btnLine}>
        <button onClick={handleSave} className={styles.button}>
          Save
        </button>
      </div>
    </div>
  );
};

export default GroupInfo;
