import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

interface ProgressBarProps {
    duration: number;
    currentPosition: number;
    onSeek: any;
}

export default function ProgressBar ({ duration, currentPosition, onSeek }: ProgressBarProps) {
    const [ width, setWidth ] = useState(0);
    const progress = useSharedValue(0);

    React.useEffect(() => {
        if (duration > 0) {
            progress.value = currentPosition / duration;
        }
    }, [currentPosition, duration]);

    const panGesture = Gesture.Pan().onUpdate((event) => {
        const newProgress = Math.min(Math.max(event.x / width, 0), 1);
        progress.value = newProgress;
    }).onEnd(() => {
        runOnJS(onSeek)(progress.value * duration);
    });

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    return (
        <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={styles.track}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.gestureArea}>
                    <Animated.View style={[styles.fill, animatedStyle]} />
                </View>
            </GestureDetector>
        </View>
    )
}

const styles = StyleSheet.create({
    track: {
        height: 5,
        backgroundColor: '#333',
        borderRadius: 2,
        marginVertical: 20,
        width: '95%',
    },
    gestureArea: {
        height: 40,
        top: -18,
        justifyContent: 'center',
    },
    fill: {
        height: 4,
        backgroundColor: '#FFF',
        borderRadius: 2,
    },
});