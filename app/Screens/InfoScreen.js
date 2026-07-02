import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React from 'react';
import theme from '../../src/style/Constants';
import design from '../../src/style/design';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RF, RH, RS, RW } from '../../src/utlis/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';

const INFO_DATA = [
    "Developed using React Native",
    "Core Features: Add, edit, delete, and organize notes",
    "Offline Access with AsyncStorage",
    "Clean and minimalist UI",

];

const InfoScreen = () => {
    const navigation = useNavigation();


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.headerIconContainer}>
                    <Ionicons
                        name="chevron-back"
                        size={RS(25)}
                        color={theme.color.iconColor}
                    />
                </TouchableOpacity>
                <Text style={[design.heading, styles.headerText]}>App Info</Text>
            </View>

            <FlatList
                data={INFO_DATA}
                renderItem={({ item }) => (
                    <Text style={styles.infoText}>■  {item}</Text>

                )}

                contentContainerStyle={styles.infoContainer}
            />
            <Text style={design.subHeading}>Created by: <Text style={{ fontFamily: theme.Fonts.Extra_Bold, fontSize: RF(17) }}>Muhammad Usman Kashif</Text> </Text>
            <Text style={[design.subHeading, { fontSize: RF(14) }]}>Email: <Text style={{ fontFamily: theme.Fonts.Bold }}>usmankashifryk@gmail.com</Text> </Text>
        </SafeAreaView>
    );
};

export default InfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.background,
        paddingHorizontal: RS(20),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconContainer: {
        backgroundColor: '#3B3B3B',
        height: RH(40),
        width: RW(40),
        borderRadius: RS(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: RF(24),
        marginLeft: RW(15),
        fontFamily: theme.Fonts.Extra_Bold
    },
    infoContainer: {
        marginTop: RH(20),
    },
    infoText: {
        fontSize: RH(16),
        marginVertical: RH(5),
        color: theme.color.textColor,
        lineHeight: RH(24),
    },
    backupButton: {
        backgroundColor: theme.color.primary,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 25,
    },

    restoreButton: {
        backgroundColor: theme.color.surface,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1,
        borderColor: theme.color.border,
    },

    backupButtonText: {
        color: '#fff',
        fontSize: RF(15),
        fontFamily: theme.Fonts.Bold,
    },
});
