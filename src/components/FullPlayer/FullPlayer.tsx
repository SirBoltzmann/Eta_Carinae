import { Pressable, View, Text, StyleSheet, Image, useWindowDimensions } from "react-native";
import { usePlayer } from "../../store/playerStore";
import { Play, Pause, SkipBack, SkipForward, ChevronDown, RotateCcw } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import ProgressBar from "../ProgressBar/ProgressBar";
import { formatDuration } from "../../utils/timeConverter";
import  Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

export default function FullPlayer() {
    const { currentSong, isPlaying, togglePlay, nextSong, prevSong, collapse, seekTo, duration, position, isLoading } = usePlayer();
    const { width } = useWindowDimensions();
    const imageWidth = width * 0.9;

    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            if (isLoading) return;
            translateX.value = event.translationX;
            opacity.value = 1 - Math.abs(event.translationX) / 400;
        })
        .onEnd((event) => {
            if (isLoading) return;
            if (event.translationX < -100 || event.velocityX < -500) {
                translateX.value = withTiming(-500, { duration: 200 }, () => {
                    runOnJS(nextSong)();
                    translateX.value = 0;
                    opacity.value = withTiming(1);
                });
            } else if (event.translationX > 100 || event.velocityX > 500) {
                translateX.value = withTiming(500, { duration: 200 }, () => {
                    runOnJS(prevSong)();
                    translateX.value = 0;
                    opacity.value = withTiming(1);
                });
            } else {
                translateX.value = withSpring(0);
                opacity.value = withTiming(1);
            }

            if (event.translationY > 100 && Math.abs(event.translationY) > Math.abs(event.translationX)) {
                runOnJS(collapse)();
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: isLoading ? withTiming(0.1) : opacity.value,
    }));

    if (!currentSong) return null;

    return (
        <GestureDetector gesture={gesture}>
            <LinearGradient
                style={{ flex: 1 }}
                colors={[ "#190b22", "#070105", "#190b22"]}
                start={{ x: 0, y: 0 }} 
                end={{ x: 0, y: 1 }}
            >
                <Pressable onPress={collapse}>
                    <ChevronDown style={{ marginTop: 15, marginLeft: 20 }} size={36} color="white" />
                </Pressable>
                <View style={styles.container}>
                    <Animated.Image 
                        source={currentSong.coverUrl} 
                        style={[{ 
                            width: imageWidth,
                            height: imageWidth, 
                            alignSelf: "center", 
                            maxWidth: 370,
                            maxHeight: 370,
                            borderRadius: 10,
                            borderWidth: 0.3,
                            borderColor: "#777",
                        }, animatedStyle]}
                        resizeMode="contain"
                    />

                    <View>
                        <Text style={styles.title}>{currentSong.title.length >= 35 ? currentSong.title.slice(0, 35) + ".." : currentSong.title}</Text>
                        <Text style={styles.artist}>{currentSong.artist}</Text>
                    </View>

                    <View style={styles.progressBarWrapper}>
                        <ProgressBar
                            duration={duration}
                            currentPosition={position}
                            onSeek={seekTo}
                        />

                        <View style={styles.currentTime}>
                            <Text style={{ color: "#fff" }}>{formatDuration(position)}</Text>
                            <Text style={{ color: "#fff" }}>{formatDuration(duration)}</Text>
                        </View>
                    </View>

                    <View style={styles.btnWrapper}>
                        <Pressable onPress={prevSong}>
                            <SkipBack size={36} color="white" fill="white" />
                        </Pressable>

                        <Pressable onPress={togglePlay} disabled={isLoading}>
                            {isLoading ? (
                                <RotateCcw size={56} color="white" />
                            ) : isPlaying ? (
                                <Pause size={56} color="white" fill="white" />
                            ) : (
                                <Play size={56} color="white" fill="white" />
                            )}
                        </Pressable>

                        <Pressable onPress={nextSong}>
                            <SkipForward size={36} color="white" fill="white" /> 
                        </Pressable>
                    </View>
                </View>
            </LinearGradient>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        paddingTop: 30,
        padding: 10,
        gap: 10,
    },

    title: {
        fontSize: 27,
        fontWeight: 800,
        color: "#ffffff",
        alignSelf: "flex-start",
        marginLeft: 20,
        marginTop: 25,
    },

    artist: {
        fontSize: 17,
        fontWeight: 300,
        color: "#ffffff",
        marginLeft: 20,
    },

    progressBarWrapper: {
        marginTop: 10,
        width: "100%",
        alignItems: "center",
    },

    currentTime: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    btnWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: 40,
        marginTop: 40,
    }
});
