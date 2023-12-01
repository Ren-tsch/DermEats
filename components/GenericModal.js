import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import colors from './colors';

// GenericModal Komponente mit verschiedenen konfigurierbaren Eigenschaften
const GenericModal = ({
  isVisible, // Steuert die Sichtbarkeit des Modals
  onClose, // Funktion, die bei Schließen des Modals aufgerufen wird
  children // Kinder-Elemente, die im Modal angezeigt werden
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

// Styling der Komponente
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
  },
});

export default GenericModal;
