import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { color } from '../style/Constants';

const Splash = () => {
  return (
    <View style={styles.Contianer}>
      <Image style={styles.logo} source={require('../assets/images/logo.png')}/>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
    logo:{
        height:scale(190),
        width:scale(190),
    },
    Contianer:{
        flex:1,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
    }
})