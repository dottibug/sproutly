import { Modal, View, Text, TextInput } from 'react-native';
import { appStyles } from '../../../styles/theme';
import Heading from '../../ui/Heading';
import { useState } from 'react';
import Button from '../../ui/buttons/AppButton';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import AppModal from '../../ui/AppModal';

// TODO: Title for the modal and text in modal such as "Add a new note for {seed variety} {seed plant}"
// TODO: Error handling if both the note and title are blank (nothing to save)

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
    // TODO: Error handling to go here

    // Do not await database insert
    addNote({ userSeedId, title: title || null, note }).catch((error) => console.error('Error adding note to seed:', error));

    onRequestClose();
  };

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose} title="New Note">
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
    </AppModal>
  );
}
