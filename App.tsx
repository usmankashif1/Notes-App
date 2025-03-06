import { StyleSheet } from 'react-native'
import React from 'react'
import StackNavigation from './src/navigation/StackNavigation'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <StackNavigation/>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({})