import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import theme from '../../src/style/Constants';
import design from '../../src/style/design';
import { RF, RH, RS, RW } from '../../src/utlis/responsive';

const ACTION_WIDTH = 96;
const SWIPE_LIMIT = 120;
const OPEN_THRESHOLD = 60;

const SwipeNoteItem = ({ item, onPress, onDelete }) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-8, 8])
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate(event => {
            const nextValue = startX.value + event.translationX;

            if (nextValue < 0) {
                translateX.value = Math.max(nextValue, -SWIPE_LIMIT);
            }
        })
        .onEnd(() => {
            if (translateX.value < -OPEN_THRESHOLD) {
                translateX.value = withTiming(-ACTION_WIDTH, { duration: 120 });
            } else {
                translateX.value = withTiming(0, { duration: 120 });
            }
        });

    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const deleteStyle = useAnimatedStyle(() => {
        const width = interpolate(
            translateX.value,
            [-SWIPE_LIMIT, 0],
            [SWIPE_LIMIT, 0],
            Extrapolation.CLAMP,
        );

        return {
            width,
        };
    });

    const iconStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            translateX.value,
            [-SWIPE_LIMIT, -40, 0],
            [1.15, 0.9, 0.4],
            Extrapolation.CLAMP,
        );

        const opacity = interpolate(
            translateX.value,
            [-60, 0],
            [1, 0],
            Extrapolation.CLAMP,
        );

        return {
            opacity,
            transform: [{ scale }],
        };
    });

    const handleDelete = () => {
        translateX.value = withTiming(0, { duration: 100 });
        onDelete(item.id);
    };

    return (
        <View style={styles.wrapper}>
            <Animated.View style={[styles.deleteContainer, deleteStyle]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.deleteButton}
                    onPress={handleDelete}>
                    <Animated.View style={[styles.deleteContent, iconStyle]}>
                        <MaterialCommunityIcons
                            name="delete-outline"
                            size={RS(25)}
                            color="#fff"
                        />
                        <Text style={styles.deleteText}>Delete</Text>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>

            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.cardContainer, cardStyle]}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.notesContainer}
                        onPress={onPress}>
                        {item.title !== '' && (
                            <Text numberOfLines={1} style={[design.heading, styles.title]}>
                                {item.title}
                            </Text>
                        )}

                        {item.Description !== '' && (
                            <Text numberOfLines={1} style={[design.subHeading, styles.Description]}>
                                {item.preview}
                            </Text>
                        )}

                        <Text style={styles.date}>{item.createdAt}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

export default SwipeNoteItem;

const styles = StyleSheet.create({
    wrapper: {
        minHeight: RH(96),
        marginVertical: RH(8),
        justifyContent: 'center',
    },

    cardContainer: {
        zIndex: 2,
    },

    notesContainer: {
        minHeight: RH(96),
        width: '100%',
        borderRadius: RS(20),
        paddingHorizontal: RW(16),
        paddingVertical: RH(14),
        justifyContent: 'center',
        backgroundColor: theme.color.card,
        borderWidth: 1,
        borderColor: theme.color.border,
    },

    title: {
        color: theme.color.textColor,
        fontSize: RF(18),
        fontFamily: theme.Fonts.Bold,
        marginBottom: RH(4),
    },

    Description: {
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

    deleteContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: RS(20),
        overflow: 'hidden',
        backgroundColor: theme.color.danger,
        zIndex: 1,
    },

    deleteButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.color.danger,
    },

    deleteContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    deleteText: {
        marginTop: RH(3),
        fontSize: RF(11),
        fontFamily: theme.Fonts.Semi_Bold,
        color: '#fff',
    },
});