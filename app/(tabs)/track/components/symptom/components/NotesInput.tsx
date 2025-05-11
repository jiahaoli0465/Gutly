import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../../../../../context/ThemeContext';
import { INPUT_ACCESSORY_ID } from '../constants';

type NotesInputProps = {
  notes: string;
  onNotesChange: (notes: string) => void;
  stepNumber: number;
};

export const NotesInput = ({
  notes,
  onNotesChange,
  stepNumber,
}: NotesInputProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.formStep}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>{stepNumber}</Text>
        </View>
        <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
          Additional Notes (optional)
        </Text>
      </View>

      <View
        style={[
          styles.notesContainer,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        <TextInput
          style={[styles.notesInput, { color: theme.colors.text.primary }]}
          placeholder="Add any details about this symptom..."
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          maxLength={250}
          textAlignVertical="top"
          value={notes}
          onChangeText={onNotesChange}
          inputAccessoryViewID={
            Platform.OS === 'ios' ? INPUT_ACCESSORY_ID : undefined
          }
        />

        <Text
          style={[
            styles.characterCount,
            { color: theme.colors.text.secondary },
          ]}
        >
          {notes.length}/250
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formStep: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D7EB0',
    marginRight: 10,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  notesContainer: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 80,
    maxHeight: 120,
    fontSize: 15,
    textAlignVertical: 'top',
    padding: 0,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
});
