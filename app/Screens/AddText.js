import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../src/style/Constants';
import design from '../../src/style/design';
import { RF, RS, RW, RH } from '../../src/utlis/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { KeyboardAvoidingView } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
const { height, width } = Dimensions.get('window');
import Entypo from 'react-native-vector-icons/Entypo';


const getPlainText = html => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};


const AddText = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const richText = useRef(null);
  const [content, setContent] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleBackButtonPress = () => {
    if (!title.trim() && !getPlainText(content)) {
      navigation.goBack();
    } else {
      toggleModal();
    }
  };

  const handleSavePress = () => {
    if (!title.trim() && !getPlainText(content)) {
      navigation.goBack();
    } else {
      saveNote();
    }
  };


  const saveNote = async () => {
    const storedNotes = await AsyncStorage.getItem('notes');
    const notes = storedNotes ? JSON.parse(storedNotes) : [];
    const date = new Date();
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const formatedDate = `${months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    const hours = date.getHours();

    const formatedTime = `${hours % 12 || 12}:${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'
      }`;


    const newNote = {
      id: Date.now(),
      title,
      content,
      preview: getPlainText(content),
      createdAt: `${formatedTime}, ${formatedDate}`,
      updatedAt: `${formatedTime}, ${formatedDate}`,
    };


    const updatedNotes = [newNote, ...notes];

    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

    navigation.goBack();
  };

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.Container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={handleBackButtonPress}
            style={[styles.HeaderIconContainer, { marginLeft: 0 }]}>
            <Ionicons
              name="chevron-back"
              size={RS(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.HeaderIconContainer}
            onPress={handleSavePress}>
            <Ionicons
              name="save-outline"
              size={RS(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>
        </View>


        <TextInput
          style={styles.TitleInput}
          multiline
          placeholder="Title"
          placeholderTextColor={theme.color.textColor}
          placeholderTextColor={theme.color.mutedText}
          onChangeText={val => setTitle(val)}
          onFocus={() => {
            setShowToolbar(false);
          }}
        />


        <View style={styles.editorWrapper}>
          <RichEditor
            ref={richText}
            initialContentHTML=""
            placeholder="Type something..."
            editorStyle={{
              backgroundColor: theme.color.background,
              color: theme.color.textColor,
              placeholderColor: theme.color.mutedText,
              contentCSSText: `
        font-size: 17px;
        line-height: 26px;
        font-family: Arial;
        padding: 0px;
      `,
            }}
            style={styles.richEditor}
            onChange={html => setContent(html)}
            onFocus={() => {
              setShowToolbar(true);
            }}
          />
        </View>


        {showToolbar && (
          <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.heading1,
                actions.undo,
                actions.redo,
              ]}
              iconTint={theme.color.mutedText}
              selectedIconTint={theme.color.primary}
              style={styles.toolbar}
            />
          </Animated.View>
        )}


        {/* <Modal
          animationType="fade"
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <View style={styles.ModalContainer}>
              <Foundation name="info" size={RS(55)} color="#606060" />

              <Text
                style={[
                  design.heading,
                  { fontSize: RS(25), marginVertical: 10 },
                ]}>
                Save Changes!
              </Text>

              <View style={styles.ButtonContainer}>
                <TouchableOpacity
                  style={[styles.ModalButton, { backgroundColor: 'red' }]}
                  onPress={() => {
                    handleBackButtonPress();
                    navigation.navigate('Home')
                  }}>
                  <Text style={styles.ModalText}>Discard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.ModalButton, { backgroundColor: '#30BE71' }]}
                  onPress={() => {
                    saveNote();
                    setModalVisible(false);
                  }}>
                  <Text style={styles.ModalText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}



        <Modal
          animationType="fade"
          visible={modalVisible}
          transparent
          statusBarTranslucent
          onRequestClose={() => setModalVisible(false)}>

          <View style={styles.modalOverlay}>
            <View style={styles.ModalContainer}>


              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.deleteCloseButton}
                onPress={() => setModalVisible(false)}>
                <Entypo name="cross" size={RS(22)} color={theme.color.mutedText} />
              </TouchableOpacity>  <TouchableOpacity
                activeOpacity={0.8}
                style={styles.deleteCloseButton}
                onPress={() => setModalVisible(false)}>
                <Entypo name="cross" size={RS(22)} color={theme.color.mutedText} />
              </TouchableOpacity>



              <View style={styles.modalIconBox}>
                <Foundation name="info" size={RS(34)} color={theme.color.primary} />
              </View>

              <Text style={styles.modalTitle}>Save changes?</Text>

              <Text style={styles.modalSubtitle}>
                You have unsaved changes. Do you want to save them before leaving?
              </Text>

              <View style={styles.ButtonContainer}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.ModalButton, styles.discardButton]}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.goBack();
                  }}>
                  <Text style={[styles.ModalText, styles.discardText]}>Discard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.ModalButton, styles.saveButton]}
                  onPress={() => {
                    setModalVisible(false);
                    saveNote();
                  }}>
                  <Text style={styles.ModalText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>




      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default AddText;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: theme.color.background,
    paddingHorizontal: RW(18),
  },

  HeaderIconContainer: {
    backgroundColor: theme.color.surface,
    height: RS(46),
    width: RS(46),
    borderRadius: RS(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  TitleInput: {
    marginTop: RH(26),
    fontSize: RF(30),
    fontFamily: theme.Fonts.Extra_Bold,
    color: theme.color.textColor,
    paddingVertical: RH(8),
    letterSpacing: -0.4,
  },

  DescriptionInput: {
    flex: 1,
    fontSize: RF(17),
    fontFamily: theme.Fonts.regular,
    color: theme.color.textColor,
    lineHeight: RF(26),
    textAlignVertical: 'top',
    paddingTop: RH(10),
  },

  ModalContainer: {
    width: '100%',
    backgroundColor: theme.color.surface,
    borderRadius: RS(28),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.color.border,
    paddingHorizontal: RW(22),
    paddingTop: RH(26),
    paddingBottom: RH(20),
  },

  ModalButton: {
    flex: 1,
    height: RH(50),
    borderRadius: RS(16),
    alignItems: 'center',
    justifyContent: 'center',
  },


  ModalText: {
    fontSize: RF(16),
    fontFamily: theme.Fonts.Bold,
    color: '#fff',
  },


  ButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: RW(12),
  },

  editorWrapper: {
    flex: 1,
    marginTop: RH(10),
    marginBottom: RH(8),
  },

  richEditor: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  toolbarContainer: {
    position: 'absolute',
    left: RW(18),
    right: RW(18),
  },
  toolbar: {
    backgroundColor: theme.color.surface,
    borderRadius: RS(18),
    borderWidth: 1,
    borderColor: theme.color.border,
    minHeight: RH(48),
    marginBottom: RH(10),
  },
  keyboardView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RW(22),
  },
  modalIconBox: {
    height: RS(64),
    width: RS(64),
    borderRadius: RS(22),
    backgroundColor: theme.color.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: RH(16),
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  modalTitle: {
    color: theme.color.textColor,
    fontSize: RF(23),
    fontFamily: theme.Fonts.Extra_Bold,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: theme.color.mutedText,
    fontSize: RF(14),
    fontFamily: theme.Fonts.regular,
    textAlign: 'center',
    lineHeight: RF(21),
    marginTop: RH(8),
    marginBottom: RH(22),
  },
  discardButton: {
    backgroundColor: theme.color.card,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  saveButton: {
    backgroundColor: theme.color.primary,
  },
  discardText: {
    color: theme.color.textColor,
  },

  deleteCloseButton: {
  position: 'absolute',
  top: RH(14),
  right: RW(14),
  height: RS(34),
  width: RS(34),
  borderRadius: RS(12),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.color.card,
},
});