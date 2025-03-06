import React, {useState} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../style/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('window');

const ViewNote = ({route}) => {
  const navigation = useNavigation();
  const {note} = route.params;
  const [iseditAble, setISeditable] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [Description, setDescription] = useState(note.Description);

  const toggleEditMode = () => {
// const saveNote = async () => {
//   const storedNotes = await AsyncStorage.getItem('notes');
//   const notes = storedNotes ? JSON.parse(storedNotes) : [];
//   const date = new Date();
//   const months = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];
//   const formatedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
//   const hours = date.getHours();
//   const formatedTime = `${hours % 12 || 12}:${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
//   const newNote = {
//     id: Date.now(),
//     title,
//     Description,
//     createdAt: `${formatedTime}, ${formatedDate}`,
//   };
//   notes.push(newNote);
//   await AsyncStorage.setItem('notes', JSON.stringify(notes));
//   setISeditable(false);
//   navigation.goBack();
//   ('navigation.goBack()');
// };
    setISeditable(!iseditAble);
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

    const formatedDate = `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
    const hours = date.getHours();

    const formatedTime = `${hours % 12 || 12}:${date.getMinutes()} ${
      date.getHours() >= 12 ? 'PM' : 'AM'
    }`;

    const UpdateNote =notes.map(item=>item.id===note.id ? {
      ...item,
      id: Date.now(),
      title,
      Description,
      createdAt: `${formatedTime}, ${formatedDate}`,
    }:item);
    // notes.push(UpdateNote);
    await AsyncStorage.setItem('notes', JSON.stringify(UpdateNote));
    setISeditable(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={saveNote}
          style={[styles.HeaderIconContainer, {marginLeft: 0}]}>
          <Ionicons
            name="chevron-back"
            size={scale(22)}
            color={theme.color.iconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={saveNote} style={styles.HeaderIconContainer}>
          <Ionicons
            name="save-outline"
            size={scale(22)}
            color={theme.color.iconColor}
          />
        </TouchableOpacity>
      </View>
      <Pressable onPress={toggleEditMode} style={styles.subContainer}>
        {iseditAble ? (
          <View style={styles.subContainer}>
            <Text style={styles.date}>{note.createdAt}</Text>

            <TextInput
              style={styles.TitleInput}
              multiline={true}
              placeholder="Title"
              placeholderTextColor={theme.color.textColor}
              onChangeText={val => setTitle(val)}
              value={title}
            />
            <TextInput
              style={styles.DescriptionInput}
              multiline={true}
              placeholder="Type something..."
              placeholderTextColor={theme.color.textColor}
              onChangeText={val => setDescription(val)}
              value={Description}
            />
          </View>
        ) : (
          <View style={styles.subContainer}>
            <Text style={styles.date}>{note.createdAt}</Text>

            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.description}>{note.Description}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default ViewNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
    padding: 20,
  },
  title: {
    marginTop: 15,
    fontSize: scale(27),
    fontFamily: theme.Fonts.Bold,
    color: theme.color.textColor,
  },
  description: {
    fontSize: scale(16),
    fontFamily: theme.Fonts.regular,
    color: theme.color.textColor,
    left:0.5
  },
  date: {
    fontSize: 14,
    color: '#bdbcbb',
  },
  subContainer: {
    marginVertical: height * 0.02,
  },
  HeaderIconContainer: {
    backgroundColor: '#3B3B3B',
    height: scale(45),
    width: scale(45),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  TitleInput: {
    marginTop: 15,
    fontSize: scale(27),
    fontFamily: theme.Fonts.Bold,
    color: theme.color.textColor,
    bottom:10,
    right:4

  },
  DescriptionInput: {
    fontSize: scale(16),
    fontFamily: theme.Fonts.regular,
    color: theme.color.textColor,
    bottom:31,
    right:4,
    

  },
});
