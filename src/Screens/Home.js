import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import design from '../style/design';
import theme from '../style/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height,width}=Dimensions.get('window');

const Home = () => {
  const [title,setTitle]=useState('');
  const [Description,setDescription]=useState('');

  useFocusEffect(
    useCallback(() => {

    const show=()=>{
    const title2=AsyncStorage.getItem('titleH');
    setTitle(title2);
    
    };
    show();
  }, [])
);
  const navigation=useNavigation();
  return (
    <View style={styles.Container}>
      <View style={{flexDirection: 'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={design.heading}>Notes</Text>
        <View style={{flexDirection:'row',}}>
        <TouchableOpacity style={styles.HeaderIconContainer}>
          <Ionicons
            name="search-sharp"
            size={scale(22)}
            color={theme.color.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('InfoScreen')} style={styles.HeaderIconContainer}>
          <MaterialIcons
            name="info-outline"
            size={scale(22)}
            color={theme.color.iconColor}
          />
        </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imgContainer}>
        <Image
          style={styles.emptyImg}
          source={require('../assets/images/empty.png')}
        />
        <Text style={design.subHeading}>Create your first note !</Text>
        <Text style={{color:'white',fontSize:20}}>{title}</Text>
      </View>
      
      <TouchableOpacity onPress={()=>navigation.navigate('AddText')} style={styles.AddButton}>
      <Entypo name='plus' size={scale(40)} color={theme.color.iconColor}/>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: theme.color.background,
    padding: 15  ,
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
    marginLeft:15
  },
  AddButton: {
    height: height * 0.085,
    width: width * 0.17,
    position: 'absolute',
    bottom: scale(35),
    right: scale(35),
    backgroundColor:'#3B3B3B',
    elevation: 10, 
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowRadius: 6, 
    shadowOpacity: 0.3, 
  },

});
