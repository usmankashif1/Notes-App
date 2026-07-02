import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

const BACKUP_MIME = 'application/json';

const getBackupFileName = () => {
    const date = new Date();
    const safeDate = date.toISOString().replace(/[:.]/g, '-');
    return `notes-backup-${safeDate}.json`;
};

export const exportNotesBackup = async () => {
    try {
        const storedNotes = await AsyncStorage.getItem('notes');
        const notes = storedNotes ? JSON.parse(storedNotes) : [];

        const backupData = {
            appName: 'Notes App',
            version: 1,
            exportedAt: new Date().toISOString(),
            totalNotes: notes.length,
            notes,
        };

        const fileName = getBackupFileName();
        const json = JSON.stringify(backupData, null, 2);

        // Android: ask user to choose real folder
        if (Platform.OS === 'android') {
            const permissions =
                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

            if (!permissions.granted) {
                Alert.alert('Cancelled', 'No folder selected.');
                return;
            }

            const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
                permissions.directoryUri,
                fileName,
                BACKUP_MIME,
            );

            await FileSystem.writeAsStringAsync(fileUri, json, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            Alert.alert('Backup created', 'Your notes backup was saved successfully.');
            return;
        }

        // iOS: create temp file, then user chooses Save to Files
        const fileUri = FileSystem.cacheDirectory + fileName;

        await FileSystem.writeAsStringAsync(fileUri, json, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        const isAvailable = await Sharing.isAvailableAsync();

        if (!isAvailable) {
            Alert.alert('Error', 'Sharing is not available on this device.');
            return;
        }

        await Sharing.shareAsync(fileUri, {
            mimeType: BACKUP_MIME,
            dialogTitle: 'Save notes backup',
            UTI: 'public.json',
        });
    } catch (error) {
        console.log('Backup error:', error);
        Alert.alert('Backup failed', 'Something went wrong while creating backup.');
    }
};

export const importNotesBackup = async () => {
    try {
        const storedNotes = await AsyncStorage.getItem('notes');
        const CurrentNotes = storedNotes ? JSON.parse(storedNotes) : [];

        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
        });

        if (result.canceled) return;

        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        const backupData = JSON.parse(fileContent);

        if (!backupData.notes || !Array.isArray(backupData.notes)) {
            Alert.alert('Invalid file', 'This is not a valid notes backup file.');
            return;
        }

        const notes = [...CurrentNotes, ...backupData.notes]

        await AsyncStorage.setItem('notes', JSON.stringify(notes));

        Alert.alert(
            'Restore complete',
            `${backupData.notes.length} notes restored successfully.`,
        );
    } catch (error) {
        console.log('Restore error:', error);
        Alert.alert('Restore failed', 'Invalid backup file or something went wrong.');
    }
};