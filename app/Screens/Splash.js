import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { color } from '../../src/style/Constants';
import { RH, RW } from '../../src/utlis/responsive';

const Splash = () => {
  return (
    <View style={styles.Contianer}>
      <Image style={styles.logo} source={require('../../src/assets/images/logo.png')} />
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  logo: {
    height: RH(190),
    width: RW(190),
  },
  Contianer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }
})