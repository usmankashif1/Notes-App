import {
  Dimensions,
  InputAccessoryView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import theme from '../style/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Foundation from 'react-native-vector-icons/Foundation';
import design from '../style/design';

const {height, width} = Dimensions.get('window');
const AddText = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [Description, setDescription] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleBackButtonPress = () => {
    if (!title.trim() && !Description.trim()) {
      navigation.goBack();
    } else {
      toggleModal();
    }
  };

  const handleSavePress = () => {
    if (!title.trim() && !Description.trim()) {
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

    const formatedDate = `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
    const hours = date.getHours();

    const formatedTime = `${hours % 12 || 12}:${date.getMinutes()} ${
      date.getHours() >= 12 ? 'PM' : 'AM'
    }`;

    const newNote = {
      id: Date.now(),
      title,
      Description,
      createdAt: `${formatedTime}, ${formatedDate}`,
    };
    notes.push(newNote);
    await AsyncStorage.setItem('notes', JSON.stringify(notes));

    navigation.goBack();
  };

  const navigation = useNavigation();
  return (
    <View style={styles.Container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={handleBackButtonPress}
          style={[styles.HeaderIconContainer, {marginLeft: 0}]}>
          <Ionicons
            name="chevron-back"
            size={scale(22)}
            color={theme.color.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.HeaderIconContainer}
          onPress={handleSavePress}>
          <Ionicons
            name="save-outline"
            size={scale(22)}
            color={theme.color.iconColor}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.TitleInput}
        multiline={true}
        placeholder="Title"
        placeholderTextColor={theme.color.textColor}
        onChangeText={val => setTitle(val)}
      />
      <TextInput
        style={styles.DescriptionInput}
        multiline={true}
        placeholder="Type something..."
        placeholderTextColor={theme.color.textColor}
        onChangeText={val => setDescription(val)}
      />
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <View style={styles.ModalContainer}>
            <Foundation name="info" size={scale(55)} color="#606060" />

            <Text
              style={[
                design.heading,
                {fontSize: scale(25), marginVertical: 10},
              ]}>
              Save Changes!
            </Text>

            <View style={styles.ButtonContainer}>
              <TouchableOpacity
                style={[styles.ModalButton, {backgroundColor: 'red'}]}
                onPress={() => {
                  handleBackButtonPress();
                  navigation.navigate('Home')
                }}>
                <Text style={styles.ModalText}>Discard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ModalButton, {backgroundColor: '#30BE71'}]}
                onPress={() => {
                  saveNote();
                  setModalVisible(false);
                }}>
                <Text style={styles.ModalText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddText;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#252525',
    padding: 20,
  },
  HeaderIconContainer: {
    backgroundColor: '#3B3B3B',
    height: scale(45),
    width: scale(45),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleInput: {
    marginTop: 20,
    fontSize: scale(27),
    fontFamily: theme.Fonts.Bold,
    color: theme.color.textColor,
  },
  DescriptionInput: {
    fontSize: scale(16),
    fontFamily: theme.Fonts.regular,
    color: theme.color.textColor,
  },

  ModalContainer: {
    backgroundColor: '#252525',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    height: height * 0.28,
    width: width * 0.9,
  },
  ModalButton: {
    height: height * 0.065,
    width: width * 0.32,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginVertical: height * 0.016,
    borderRadius: 5,
  },
  ModalText: {
    fontSize: scale(18),
    fontFamily: theme.Fonts.Semi_Bold,
    color: 'white',
  },
  ButtonContainer: {
    flexDirection: 'row',
  },
});
