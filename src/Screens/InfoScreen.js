import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React from 'react';
import theme from '../style/Constants';
import design from '../style/design';
import { scale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const INFO_DATA = [
    "Developed using React Native",
    "Core Features: Add, edit, delete, and organize notes",
    "Offline Access with AsyncStorage",
    "Clean and minimalist UI",
   
];

const InfoScreen = () => {
    const navigation = useNavigation();

    

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.headerIconContainer}>
                    <Ionicons
                        name="chevron-back"
                        size={scale(25)}
                        color={theme.color.iconColor}
                    />
                </TouchableOpacity>
                <Text style={[design.heading, styles.headerText]}>App Info</Text>
            </View>

            <FlatList
                data={INFO_DATA}
                renderItem={({item})=>(
                    <Text style={styles.infoText}>■  {item}</Text>

                )}
                
                contentContainerStyle={styles.infoContainer}
            />
            <Text style={design.subHeading}>Created by: <Text style={{fontFamily:theme.Fonts.Extra_Bold,fontSize:scale(17)}}>Muhammad Usman kashif</Text> </Text>
            <Text style={[design.subHeading,{fontSize:scale(14)}]}>Email: <Text style={{fontFamily:theme.Fonts.Bold}}>usmankashifryk@gmail.com</Text> </Text>
        </View>
    );
};

export default InfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.background,
        padding: scale(20),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconContainer: {
        backgroundColor: '#3B3B3B',
        height: scale(40),
        width: scale(40),
        borderRadius: scale(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: scale(24),
        marginLeft: scale(15),
        fontFamily:theme.Fonts.Extra_Bold
    },
    infoContainer: {
        marginTop: scale(20),
        // paddingHorizontal: scale(10),
    },
    infoText: {
        fontSize: scale(16),
        marginVertical: scale(5),
        color: theme.color.textColor,
        lineHeight: scale(24),
    },
});
