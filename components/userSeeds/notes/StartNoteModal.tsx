import { Modal, View, Text, TextInput } from 'react-native';
import { appStyles } from '../../../styles/theme';
import Heading from '../../ui/Heading';
import { useState } from 'react';
import Button from '../../ui/buttons/Button';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';

// TODO: Proper close button on modal in the corner

type StartNoteModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly userSeedId: string;
};

export default function StartNoteModal({ visible, onRequestClose, userSeedId }: StartNoteModalProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const { addNote } = useUserSeed();

  const handleSaveNote = async () => {
    console.log('save note');

    try {
      await addNote({ userSeedId, title: title || null, note });
      onRequestClose();
    } catch (error) {
      console.error('Error adding note to seed:', error instanceof Error ? error.message : 'Unknown error');
    }
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
              value={note}
              onChangeText={setNote}
              multiline
              style={appStyles.customSeedMultilineInput}
            />
          </View>

          <Button text="Save" size="small" onPress={handleSaveNote} />
          <Button text="Cancel" size="small" onPress={onRequestClose} color="secondary" />
        </View>
      </View>
    </Modal>
  );
}
