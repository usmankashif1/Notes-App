import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import theme from '../../src/style/Constants';
import design from '../../src/style/design';
import { RF, RH, RS, RW } from '../../src/utlis/responsive';
import { exportNotesBackup, importNotesBackup } from '../../src/utlis/backupNotes';

const SettingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconContainer}>
          <Ionicons
            name="chevron-back"
            size={RS(24)}
            color={theme.color.iconColor}
          />
        </TouchableOpacity>

        <Text style={[design.heading, styles.headerText]}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>

        <Text style={styles.sectionTitle}>Backup & Restore</Text>

        <TouchableOpacity style={styles.settingCard} onPress={exportNotesBackup}>
          <View style={styles.iconBox}>
            <Ionicons name="cloud-upload-outline" size={RS(23)} color="#fff" />
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Backup Notes</Text>
            <Text style={styles.cardSubtitle}>
              Export all notes as a local backup file
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={RS(20)}
            color={theme.color.mutedText}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingCard} onPress={importNotesBackup}>
          <View style={styles.iconBox}>
            <Ionicons name="cloud-download-outline" size={RS(23)} color="#fff" />
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Restore Backup</Text>
            <Text style={styles.cardSubtitle}>
              Import notes from a backup file
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={RS(20)}
            color={theme.color.mutedText}
          />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>App</Text>

        <TouchableOpacity
          style={styles.settingCard}
          onPress={() => navigation.navigate('InfoScreen')}>
          <View style={styles.iconBox}>
            <MaterialIcons name="info-outline" size={RS(23)} color="#fff" />
          </View>

          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>App Info</Text>
            <Text style={styles.cardSubtitle}>
              Version, features, and developer details
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={RS(20)}
            color={theme.color.mutedText}
          />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.background,
    paddingHorizontal: RW(18),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIconContainer: {
    backgroundColor: theme.color.surface,
    height: RS(46),
    width: RS(46),
    borderRadius: RS(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  headerText: {
    fontSize: RF(26),
    marginLeft: RW(14),
    fontFamily: theme.Fonts.Extra_Bold,
  },

  contentContainer: {
    paddingTop: RH(28),
    paddingBottom: RH(40),
  },

  sectionTitle: {
    color: theme.color.mutedText,
    fontSize: RF(13),
    fontFamily: theme.Fonts.Bold,
    marginBottom: RH(10),
    marginTop: RH(14),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  settingCard: {
    minHeight: RH(78),
    backgroundColor: theme.color.card,
    borderRadius: RS(20),
    paddingHorizontal: RW(14),
    paddingVertical: RH(14),
    marginBottom: RH(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.color.border,
  },

  iconBox: {
    height: RS(46),
    width: RS(46),
    borderRadius: RS(15),
    backgroundColor: theme.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: RW(13),
  },

  textBox: {
    flex: 1,
  },

  cardTitle: {
    color: theme.color.textColor,
    fontSize: RF(16),
    fontFamily: theme.Fonts.Bold,
  },

  cardSubtitle: {
    color: theme.color.mutedText,
    fontSize: RF(12.5),
    fontFamily: theme.Fonts.regular,
    marginTop: RH(3),
    lineHeight: RF(18),
  },
});