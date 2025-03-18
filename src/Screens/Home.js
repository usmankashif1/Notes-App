import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import design from '../style/design';
import theme from '../style/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Swipeable} from 'react-native-gesture-handler';
import Foundation from 'react-native-vector-icons/Foundation';

const {height, width} = Dimensions.get('window');

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [FilteredNotes, setFilteredNotes] = useState([]);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const DeleteModal = noteId => {
    setNoteToDelete(noteId);
    setModalVisibleDelete(!modalVisibleDelete);
  };

  useFocusEffect(
    useCallback(() => {
      const show = async () => {
        const storedNotes = await AsyncStorage.getItem('notes');
        const allNotes = storedNotes ? JSON.parse(storedNotes) : [];
        setNotes(allNotes);
      };

      show();
    }, []),
  );

  const handleDeleteNote = async () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter(note => note.id !== noteToDelete);
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setModalVisibleDelete(false);
      setNoteToDelete(null);
    }
  };

  const filterBySearchTerm = () => {
    if (searchQuery === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.Description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredNotes(filtered);
    }
  };

  useEffect(() => {
    filterBySearchTerm();
  }, [searchQuery]);

  const navigation = useNavigation();

  const rightSwipe = item => {
    return (
      <TouchableOpacity
        style={styles.rightSwipeStyle}
        onPress={() => DeleteModal(item.id)}>
        <MaterialCommunityIcons name="delete" size={25} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.Container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: scale(55),
        }}>
        <Text style={design.heading}>Notes</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.HeaderIconContainer}>
            <Ionicons
              name="search-sharp"
              size={scale(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('InfoScreen')}
            style={styles.HeaderIconContainer}>
            <MaterialIcons
              name="info-outline"
              size={scale(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      {notes.length === 0 ? (
        <View style={styles.imgContainer}>
          <Image
            style={styles.emptyImg}
            source={require('../assets/images/empty.png')}
          />
          <Text style={design.subHeading}>Create your first note!</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={({item}) => {
            const containerStyle = [
              styles.notesContainer,
              item.title === ''
                ? {height: height * 0.08}
                : item.Description === ''
                ? {height: height * 0.09}
                : {height: height * 0.11},
            ];

            return (
              <Swipeable renderRightActions={() => rightSwipe(item)}>
                <TouchableOpacity
                  style={containerStyle}
                  onPress={() => navigation.navigate('ViewNote', {note: item})}>
                  {item.title !== '' && (
                    <Text
                      numberOfLines={1}
                      style={[design.heading, styles.title]}>
                      {item.title}
                    </Text>
                  )}
                  {item.Description !== '' && (
                    <Text
                      numberOfLines={1}
                      style={[design.subHeading, styles.Description]}>
                      {item.Description}
                    </Text>
                  )}
                  <Text style={styles.date}>{item.createdAt}</Text>
                </TouchableOpacity>
              </Swipeable>
            );
          }}
          contentContainerStyle={{marginTop: scale(20), paddingBottom: 40}}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddText')}
        style={styles.AddButton}>
        <Entypo name="plus" size={scale(40)} color={theme.color.iconColor} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={false}
        onRequestClose={() => toggleModal()}>
        <View style={styles.modalContainer}>
          <View style={styles.searchBack}>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="arrow-back" color="white" size={scale(30)} />
            </TouchableOpacity>
            <TextInput
              style={styles.SearchInput}
              placeholder="Search"
              placeholderTextColor={'white'}
              onChangeText={txt => setSearchQuery(txt)}
            />
          </View>
          <FlatList
            data={FilteredNotes}
            renderItem={({item}) => {
              const containerStyle = [
                styles.notesContainer,
                item.title === ''
                  ? {height: height * 0.08}
                  : item.Description === ''
                  ? {height: height * 0.09}
                  : {height: height * 0.11},
              ];

              return (
                <TouchableOpacity style={{width: '95%', marginLeft: 10}}>
                  <TouchableOpacity
                    style={containerStyle}
                    onPress={() =>
                      navigation.navigate('ViewNote', {note: item})
                    }>
                    {item.title !== '' && (
                      <Text
                        numberOfLines={1}
                        style={[design.heading, styles.title]}>
                        {item.title}
                      </Text>
                    )}
                    {item.Description !== '' && (
                      <Text
                        numberOfLines={1}
                        style={[design.subHeading, styles.Description]}>
                        {item.Description}
                      </Text>
                    )}
                    <Text style={styles.date}>{item.createdAt}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{marginTop: scale(20), paddingBottom: 40}}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
      <Modal
        animationType="fade"
        visible={modalVisibleDelete}
        transparent={true}
        onRequestClose={() => setModalVisibleDelete(false)}>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <View style={styles.ModalContainer}>
            <View style={{flexDirection: 'row'}}>
              <Foundation
                style={{left: 20}}
                name="info"
                size={scale(55)}
                color="#606060"
              />
              <TouchableOpacity
                style={{left: 110, bottom: 5}}
                onPress={() => setModalVisibleDelete(false)}>
                <Entypo name="circle-with-cross" size={scale(35)} color="red" />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                design.heading,
                {fontSize: scale(22), marginVertical: 10},
              ]}>
              Sure to Delete this note?
            </Text>

            <TouchableOpacity
              style={[styles.ModalButton, {backgroundColor: 'red'}]}
              onPress={handleDeleteNote}>
              <Text style={styles.ModalText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: theme.color.background,
    padding: 15,
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyImg: {
    height: scale(250),
    width: scale(250),
    alignSelf: 'center',
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
  AddButton: {
    height: height * 0.085,
    width: width * 0.17,
    position: 'absolute',
    bottom: scale(35),
    right: scale(35),
    backgroundColor: theme.color.background,
    elevation: 4,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 6,
    shadowOpacity: 0.3,
  },
  notesContainer: {
    width: '100%',
    borderRadius: 3,
    marginVertical: 7,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#3B3B3B',
  },

  title: {
    color: 'white',
    fontSize: scale(17),
  },
  Description: {
    color: '#e8e6e6',
    fontSize: scale(11.5),
    fontFamily: theme.Fonts.regular,
    top: 4,
  },
  date: {
    color: '#bdbcbb',
    fontFamily: theme.Fonts.light,
    fontSize: scale(10.5),
    justifyContent: 'space-evenly',
    top: 9,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#252525',
    padding: 10,
    justifyContent: 'flex-start',
  },
  searchBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-evenly',
  },
  SearchInput: {
    borderColor: 'red',
    borderRadius: 40,
    color: 'white',
    paddingLeft: 20,
    fontSize: scale(15),
    fontFamily: theme.Fonts.regular,
    backgroundColor: '#3B3B3B',
    height: scale(43),
    width: '90%',
  },
  rightSwipeStyle: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    height: '82%',
    width: '15%',
    marginTop: 7,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
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
    height: height * 0.06,
    width: width * 0.3,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginVertical: height * 0.016,
    borderRadius: 5,
  },
  ModalText: {
    fontSize: scale(20),
    fontFamily: theme.Fonts.Extra_Bold,
    color: 'white',
  },
});
