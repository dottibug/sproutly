import { UserSeedNote } from '../../state/userSeeds/types/noteTypes';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { useEffect, useState } from 'react';
import { Modal, TextInput, View } from 'react-native';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';
import Button from '../ui/buttons/Button';

type EditNoteModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly note: UserSeedNote;
};

export default function EditNoteModal({ visible, onRequestClose, note }: EditNoteModalProps) {
  const { updateNote } = useUserSeed();

  const [title, setTitle] = useState<string>('');
  const [noteText, setNoteText] = useState<string>('');

  useEffect(() => {
    if (!visible) return;
    setTitle(note.title ?? '');
    setNoteText(note.note ?? '');
  }, [visible, note.title, note.note]);

  const handleSave = async () => {
    console.log('editing note:', { id: note.id, noteUserId: note.userId, title, noteText });

    await updateNote({ ...note, title: title || null, note: noteText });
    onRequestClose();
  };

  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent={true}>
      <View style={appStyles.modalContainer}>
        <View style={appStyles.modalContent}>
          <View style={appStyles.customSeedInputSection}>
            <Heading size="xsmall">Title</Heading>
            <TextInput placeholder="Note title" value={title} onChangeText={setTitle} style={appStyles.customSeedInput} />
          </View>
          <View style={appStyles.customSeedInputSection}>
            <Heading size="xsmall">Note</Heading>
            <TextInput
              placeholder="Write your note here..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
              style={appStyles.customSeedMultilineInput}
            />
          </View>
          <Button text="Save" size="small" onPress={handleSave} />
          <Button text="Cancel" size="small" onPress={onRequestClose} color="secondary" />
        </View>
      </View>
    </Modal>
  );
}
