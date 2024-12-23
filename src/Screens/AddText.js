import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import theme from '../style/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scale} from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddText = () => {

const [title,setTitle]=useState('');
const [Description,setDescription]=useState('');


const saveNote=async ()=>{
  
  await AsyncStorage.setItem('titleH', title);
  await AsyncStorage.setItem('DescriptionH',Description);
  // console.log(title,Description);
  

};

  const navigation=useNavigation();
  return (
    <View style={styles.Container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={()=>navigation.goBack('title1',title)} style={[styles.HeaderIconContainer,{marginLeft:0}]}>
          <Ionicons
            name="chevron-back"
            size={scale(22)}
            color={theme.color.iconColor}
          />
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.HeaderIconContainer}>
            <Ionicons
              name="eye"
              size={scale(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.HeaderIconContainer} onPress={saveNote}>
            <Ionicons
              name="save-outline"
              size={scale(22)}
              color={theme.color.iconColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput style={styles.TitleInput} multiline={true} placeholder='Title' placeholderTextColor={theme.color.textColor} onChangeText={(val)=>setTitle(val)}/>
      <TextInput style={styles.DescriptionInput} multiline={true} placeholder='Type something...' placeholderTextColor={theme.color.textColor} onChangeText={(val)=>setDescription(val)}/>
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
    marginLeft: 15,
  },
  TitleInput:{
    marginTop:20,
    fontSize:scale(27),
    fontFamily:theme.Fonts.Bold,
    color:theme.color.textColor,
    
  },
  DescriptionInput:{
    fontSize:scale(16),
    fontFamily:theme.Fonts.regular,
    color:theme.color.textColor

  }
});
