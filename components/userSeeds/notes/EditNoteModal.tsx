import { UserSeedNote } from '../../../state/userSeeds/notes/noteTypes';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { useEffect, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { appStyles } from '../../../styles/theme';
import Heading from '../../ui/Heading';
import Button from '../../ui/buttons/AppButton';
import AppModal from '../../ui/AppModal';
import { noteHasContent } from '../../../state/userSeeds/notes/noteUtils';
import Input from '../../ui/form/Input';

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
    const payloadTitle = title.trim() || null;
    const payloadNote = noteText.trim();
    if (!noteHasContent(payloadTitle, payloadNote)) {
      Alert.alert('Cannot save', 'Enter a title or note (or both).');
      return;
    }

    await updateNote({ ...note, title: payloadTitle, note: payloadNote });
    onRequestClose();
  };

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose} title="Edit Note">
      <View style={appStyles.customSeedInputSection}>
        <Input label="Title" placeholder="Note title" value={title} onChangeText={setTitle} />
      </View>
      <View style={appStyles.customSeedInputSection}>
        <Input label="Note" placeholder="Write your note here..." value={noteText} onChangeText={setNoteText} multiline />
      </View>
      <Button text="Save" size="small" onPress={handleSave} />
    </AppModal>
  );
}
