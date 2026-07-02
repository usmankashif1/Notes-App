import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import theme from '../../src/style/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { RF, RH, RS, RW } from "../../src/utlis/responsive";
import { SafeAreaView } from 'react-native-safe-area-context';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');


const getPlainText = html => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};


const ViewNote = ({ route }) => {
  const navigation = useNavigation();
  const { note } = route.params;
  const [iseditAble, setISeditable] = useState(false);
  const [title, setTitle] = useState(note.title);
  // const [Description, setDescription] = useState(note.content);
  const [content, setContent] = useState(note.content || note.Description || '');
  const richText = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const titleRef = useRef(null);


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

    const updatedNotes = notes.map(item =>
      item.id === note.id
        ? {
          ...item,
          title,
          content,
          preview: getPlainText(content),
          updatedAt: `${formatedTime}, ${formatedDate}`,
        }
        : item,
    );

    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    setISeditable(false);
    navigation.goBack();
  };


  return (
    <SafeAreaView style={styles.container}>
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
            onPress={saveNote}
            style={[styles.HeaderIconContainer, { marginLeft: 0 }]}>
            <Ionicons
              name="chevron-back"
              size={RS(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: RS(10) }}>
            {/* <TouchableOpacity
              onPress={() => setISeditable(true)}
              style={styles.HeaderIconContainer}>
              <Ionicons
                name="create-outline"
                size={RS(22)}
                color={theme.color.iconColor}
              />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={saveNote} style={styles.HeaderIconContainer}>
              <Ionicons
                name="save-outline"
                size={RS(22)}
                color={theme.color.iconColor}
              />
            </TouchableOpacity>
          </View>

        </View>


        <ScrollView
          style={styles.subContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <Text style={styles.date}>{note.createdAt}</Text>

          <TextInput
            style={styles.TitleInput}
            multiline
            placeholder="Title"
            placeholderTextColor={theme.color.mutedText}
            onChangeText={setTitle}
            value={title}
            onFocus={() => {
              setISeditable(true);
              setShowToolbar(false);
            }}

          />



          <RichEditor
            ref={richText}
            initialContentHTML={content}
            placeholder="Type something..."
            editorStyle={{
              backgroundColor: theme.color.background,
              color: theme.color.textColor,
              placeholderColor: theme.color.mutedText,
              contentCSSText: `
      font-size: 17px;
      line-height: 27px;
      font-family: Arial;
      padding: 0px;
    `,
            }}
            style={styles.richViewer}
            onChange={setContent}
            onFocus={() => {
              setISeditable(true);
              setShowToolbar(true);
            }}
          />

        </ScrollView>

        {iseditAble && showToolbar && (
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

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default ViewNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
    paddingHorizontal: RW(18),
  },

  date: {
    fontSize: RF(13),
    color: theme.color.mutedText,
    fontFamily: theme.Fonts.regular,
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

  subContainer: {
    marginVertical: RH(18),
  },

  TitleInput: {
    marginTop: RH(18),
    fontSize: RF(30),
    fontFamily: theme.Fonts.Extra_Bold,
    color: theme.color.textColor,
    letterSpacing: -0.4,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'top',
  },

  DescriptionInput: {
    marginTop: RH(14),
    fontSize: RF(17),
    fontFamily: theme.Fonts.regular,
    color: theme.color.textColor,
    lineHeight: RF(27),
    padding: 0,
    includeFontPadding: false,
    textAlignVertical: 'top',
  },

  richViewer: {
    flex: 1,
    backgroundColor: theme.color.background,
    marginTop: RH(14),
    minHeight: RH(500),
  },
  toolbar: {
    backgroundColor: theme.color.surface,
    borderRadius: RS(18),
    marginBottom: RH(10),
    borderWidth: 1,
    borderColor: theme.color.border,
    minHeight: RH(48),
  },
  keyboardView: {
    flex: 1,
  },
});