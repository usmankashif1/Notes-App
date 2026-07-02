import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import design from '../../src/style/design';
import theme from '../../src/style/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Foundation from 'react-native-vector-icons/Foundation';
import { RF, RH, RS, RW } from '../../src/utlis/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import SwipeNoteItem from '../../src/components/SwipeNoteItem';

const { height, width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [FilteredNotes, setFilteredNotes] = useState([]);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortType, setSortType] = useState('newest');

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
          item.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          item.preview?.toLowerCase().includes(searchQuery?.toLowerCase()),
      );
      setFilteredNotes(filtered);
    }
  };

  const getSortedNotes = data => {
    const sorted = [...data];

    switch (sortType) {
      case 'oldest':
        return sorted.sort((a, b) => Number(a.id) - Number(b.id));

      case 'titleAZ':
        return sorted.sort((a, b) =>
          (a.title || '').localeCompare(b.title || ''),
        );

      case 'titleZA':
        return sorted.sort((a, b) =>
          (b.title || '').localeCompare(a.title || ''),
        );

      case 'newest':
      default:
        return sorted.sort((a, b) => Number(b.id) - Number(a.id));
    }
  };


  useEffect(() => {
    filterBySearchTerm();
  }, [searchQuery]);


  return (
    <SafeAreaView style={styles.Container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: RH(55),
        }}>
        <View>
          <Text style={design.heading}>Notes</Text>
          <Text style={styles.noteCount}>{notes.length} notes</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.HeaderIconContainer}>
            <Ionicons
              name="search-sharp"
              size={RS(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SettingScreen')}
            style={styles.HeaderIconContainer}>
            <Ionicons
              name="settings-outline"
              size={RS(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      {notes.length > 0 && (
        <View style={styles.notesSectionHeader}>
          <Text style={styles.sectionLabel}>All Notes</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.sortButton}
            onPress={() => setSortModalVisible(!sortModalVisible)}>
            <Ionicons
              name="swap-vertical-outline"
              size={RS(16)}
              color={theme.color.mutedText}
            />
            <Text style={styles.sortButtonText}>Sort</Text>
          </TouchableOpacity>

          {sortModalVisible && (
            <View style={styles.sortDropdown}>
              {[
                { label: 'Newest first', value: 'newest' },
                { label: 'Oldest first', value: 'oldest' },
                { label: 'Title A to Z', value: 'titleAZ' },
                { label: 'Title Z to A', value: 'titleZA' },
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.85}
                  style={styles.sortDropdownItem}
                  onPress={() => {
                    setSortType(option.value);
                    setSortModalVisible(false);
                  }}>
                  <Text style={styles.sortDropdownText}>{option.label}</Text>

                  {sortType === option.value && (
                    <Ionicons
                      name="checkmark"
                      size={RS(18)}
                      color={theme.color.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}


      {notes.length === 0 ? (
        <View style={styles.imgContainer}>
          <Image
            style={styles.emptyImg}
            source={require('../../src/assets/images/empty.png')}
          />

          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to write your first idea.</Text>
        </View>
      ) : (
        <FlatList
          data={getSortedNotes(notes)}
          renderItem={({ item }) => {
            const containerStyle = [
              styles.notesContainer,
              { minHeight: RH(96) }
            ];

            return (
              <SwipeNoteItem
                item={item}
                onPress={() => navigation.navigate('ViewNote', { note: item })}
                onDelete={DeleteModal}
              />
            );
          }}
          // contentContainerStyle={{ marginTop: RH(20), paddingBottom: 40 }}
          contentContainerStyle={{ paddingBottom: RH(110) }}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddText')}
        style={styles.AddButton}>
        <Entypo name="plus" size={RS(40)} color={theme.color.iconColor} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={false}
        onRequestClose={() => toggleModal()}>

        {/* <View style={[styles.modalContainer, { paddingTop: Platform.OS === "ios" ? RH(30) : null }]}> */}
        <SafeAreaView style={[styles.modalContainer, { paddingTop: Platform.OS === "ios" ? RH(30) : null }]}>
          <View style={styles.searchBack}>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="arrow-back" color="white" size={RS(30)} />
            </TouchableOpacity>
            <TextInput
              style={styles.SearchInput}
              placeholder="Search"
              placeholderTextColor={'white'}
              onChangeText={txt => setSearchQuery(txt)}
            />
          </View>

          <FlatList
            data={getSortedNotes(FilteredNotes)}
            ListEmptyComponent={
              <Text style={styles.emptySubtitle}>No matching notes found.</Text>
            }
            renderItem={({ item }) => {
              const containerStyle = [
                styles.notesContainer,
                { minHeight: RH(96) }
              ];

              return (
                <TouchableOpacity
                  style={containerStyle}
                  onPress={() => {
                    if (Platform.OS === "ios") {
                      setModalVisible(false)
                    };
                    navigation.navigate('ViewNote', { note: item })
                  }
                  }>

                  {item.title !== '' && (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[design.heading, styles.title]}>
                      {item?.title}
                    </Text>
                  )}

                  {item.preview !== '' && (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[design.subHeading, styles.Description]}>
                      {item?.preview}
                    </Text>
                  )}
                  <Text style={styles.date}>{item.createdAt}</Text>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ marginTop: RH(20), paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal >

      <Modal
        animationType="fade"
        visible={modalVisibleDelete}
        transparent
        statusBarTranslucent
        onRequestClose={() => setModalVisibleDelete(false)}>

        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContainer}>


            <View style={styles.deleteIconBox}>
              <MaterialCommunityIcons
                name="delete-outline"
                size={RS(34)}
                color={theme.color.danger}
              />
            </View>

            <Text style={styles.deleteModalTitle}>Delete note?</Text>

            <Text style={styles.deleteModalSubtitle}>
              This note will be permanently removed from your device.
            </Text>

            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.deleteModalButton, styles.cancelDeleteButton]}
                onPress={() => setModalVisibleDelete(false)}>
                <Text style={styles.cancelDeleteText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.deleteModalButton, styles.confirmDeleteButton]}
                onPress={handleDeleteNote}>
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>







    </SafeAreaView >
  );
};

export default Home;


const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: theme.color.background,
    paddingHorizontal: RW(18),
  },

  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: RH(80),
  },

  emptyImg: {
    height: RH(210),
    width: RH(210),
    alignSelf: 'center',
    opacity: 0.9,
  },

  HeaderIconContainer: {
    backgroundColor: theme.color.surface,
    height: RS(46),
    width: RS(46),
    borderRadius: RS(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: RW(12),
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  AddButton: {
    height: RS(64),
    width: RS(64),
    position: 'absolute',
    bottom: RH(64),
    right: RW(30),
    backgroundColor: theme.color.primary,
    elevation: 8,
    borderRadius: RS(24),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.color.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    shadowOpacity: 0.35,
  },

  notesContainer: {
    width: '100%',
    borderRadius: RS(20),
    marginVertical: RH(8),
    paddingHorizontal: RW(16),
    paddingVertical: RH(14),
    justifyContent: 'center',
    backgroundColor: theme.color.card,
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  title: {
    width: '100%',
    color: theme.color.textColor,
    fontSize: RF(18),
    fontFamily: theme.Fonts.Bold,
    marginBottom: RH(4),
  },

  Description: {
    width: '100%',
    color: theme.color.mutedText,
    fontSize: RF(13),
    fontFamily: theme.Fonts.regular,
    lineHeight: RF(19),
  },

  date: {
    color: theme.color.mutedText,
    fontFamily: theme.Fonts.light,
    fontSize: RF(11),
    marginTop: RH(10),
  },

  modalContainer: {
    flex: 1,
    backgroundColor: theme.color.background,
    paddingHorizontal: RW(16),
  },

  searchBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RH(12),
    gap: RW(12),
  },

  SearchInput: {
    flex: 1,
    borderRadius: RS(18),
    color: theme.color.textColor,
    paddingHorizontal: RW(18),
    fontSize: RF(15),
    fontFamily: theme.Fonts.regular,
    backgroundColor: theme.color.surface,
    height: RH(48),
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  ModalContainer: {
    backgroundColor: theme.color.surface,
    borderRadius: RS(24),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.color.border,
    minHeight: height * 0.27,
    width: width * 0.88,
    padding: RS(20),
  },

  ModalButton: {
    height: RH(48),
    width: width * 0.34,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RH(18),
    borderRadius: RS(16),
  },

  ModalText: {
    fontSize: RF(17),
    fontFamily: theme.Fonts.Extra_Bold,
    color: 'white',
  },



  noteCount: {
    color: theme.color.mutedText,
    fontSize: RF(13),
    fontFamily: theme.Fonts.regular,

  },


  emptyTitle: {
    color: theme.color.textColor,
    fontSize: RF(20),
    fontFamily: theme.Fonts.Bold,
    marginTop: RH(12),
  },

  emptySubtitle: {
    color: theme.color.mutedText,
    fontSize: RF(14),
    fontFamily: theme.Fonts.regular,
    marginTop: RH(6),
    textAlign: 'center',
  },


  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RW(22),
  },

  deleteModalContainer: {
    width: '100%',
    backgroundColor: theme.color.surface,
    borderRadius: RS(28),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.color.border,
    paddingHorizontal: RW(22),
    paddingTop: RH(28),
    paddingBottom: RH(20),
  },

  deleteIconBox: {
    height: RS(66),
    width: RS(66),
    borderRadius: RS(22),
    backgroundColor: theme.color.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: RH(16),
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  deleteModalTitle: {
    color: theme.color.textColor,
    fontSize: RF(23),
    fontFamily: theme.Fonts.Extra_Bold,
    textAlign: 'center',
  },

  deleteModalSubtitle: {
    color: theme.color.mutedText,
    fontSize: RF(14),
    fontFamily: theme.Fonts.regular,
    textAlign: 'center',
    lineHeight: RF(21),
    marginTop: RH(8),
    marginBottom: RH(22),
  },

  deleteButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: RW(12),
  },

  deleteModalButton: {
    flex: 1,
    height: RH(50),
    borderRadius: RS(16),
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelDeleteButton: {
    backgroundColor: theme.color.card,
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  confirmDeleteButton: {
    backgroundColor: theme.color.danger,
  },

  cancelDeleteText: {
    color: theme.color.textColor,
    fontSize: RF(16),
    fontFamily: theme.Fonts.Bold,
  },

  confirmDeleteText: {
    color: '#fff',
    fontSize: RF(16),
    fontFamily: theme.Fonts.Bold,
  },

  notesSectionHeader: {
    position: 'relative',
    zIndex: 20,
    elevation: 20,
    marginTop: RH(22),
    marginBottom: RH(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionLabel: {
    color: theme.color.mutedText,
    fontSize: RF(13),
    fontFamily: theme.Fonts.Semi_Bold,
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RW(5),
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    paddingHorizontal: RW(12),
    height: RH(36),
    borderRadius: RS(14),
  },

  sortButtonText: {
    color: theme.color.textColor,
    fontSize: RF(13),
    fontFamily: theme.Fonts.Bold,
  },

  sortDropdown: {
    position: 'absolute',
    top: RH(42),
    right: 0,
    width: RW(180),
    backgroundColor: theme.color.surface,
    borderRadius: RS(18),
    borderWidth: 1,
    borderColor: theme.color.border,
    paddingVertical: RH(6),
    zIndex: 100,
    elevation: 100,
  },

  sortDropdownItem: {
    minHeight: RH(42),
    paddingHorizontal: RW(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sortDropdownText: {
    color: theme.color.textColor,
    fontSize: RF(13),
    fontFamily: theme.Fonts.Semi_Bold,
  },


});
