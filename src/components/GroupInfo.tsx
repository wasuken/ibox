import styles from '@/styles/GroupInfo.module.css'
import { Group } from '@/types'
import { useRouter } from 'next/router'
import { useState } from 'react'

type Props = {
  group: Group
  onSave: (group: Group) => Promise<boolean[]>
  onDelete: (groupId: number) => Promise<boolean[]>
}

const GroupInfo: React.FC<Props> = ({ group, onSave, onDelete }) => {
  const [name, setName] = useState(group.name)
  const [description, setDescription] = useState(group.description)
  const [tags, setTags] = useState<string[]>(group.tags ?? [])
  const router = useRouter()

  const handleSave = async () => {
    await onSave({ ...group, title: name, description, tags })
  }
  const handleDelete = async () => {
    const confirm = window.confirm(
      '本当に削除しますか？画像とか全部消えますよ？',
    )
    if (confirm) {
      await onDelete(group.id)
      alert('削除を完了しました')
      router.push('/')
    } else {
      alert('削除をキャンセルしました')
    }
  }

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
          value={tags.join(',')}
          onChange={(e) => setTags(e.target.value.split(','))}
          className={styles.input}
        />
      </label>
      <div className={styles.btnLine}>
        <button onClick={handleSave} className={styles.button}>
          Save
        </button>
        <button onClick={handleDelete} className={styles.dbutton}>
          Delete Group
        </button>
      </div>
    </div>
  )
}

export default GroupInfo
