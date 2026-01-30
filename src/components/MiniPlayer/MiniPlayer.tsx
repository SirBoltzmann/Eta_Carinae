import { Pressable, View, Text, StyleSheet, Image } from "react-native";
import { BlurView } from 'expo-blur';
import { usePlayer } from "../../store/playerStore";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export default function MiniPlayer() {
    const { currentSong, isPlaying, togglePlay, nextSong, prevSong, expand } = usePlayer();
    const gesture = Gesture.Pan().onUpdate((event) => {
        if (event.translationY < -50) {
            runOnJS(expand)();
        }
    });

    if (!currentSong) return null;

    return (
        <GestureDetector gesture={gesture}>
            <LinearGradient
                colors={[ "#190b22", "#070105"]}
                start={{ x: 0, y: 0 }} 
                end={{ x: 0, y: 1 }}
            >
                <Pressable onPress={expand} style={styles.container}>
                    <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                    <Image 
                        source={currentSong.coverUrl} 
                        style={styles.songCover} 
                    />

                    <View>
                        <Text style={styles.title}>{currentSong.title.length >= 15 ? currentSong.title.slice(0, 15) + ".." : currentSong.title}</Text>
                        <Text style={styles.artist}>{currentSong.artist}</Text>
                    </View>

                    <View style={styles.btnWrapper}>
                        <Pressable onPress={prevSong}>
                            <SkipBack size={24} color="white" fill="white" />
                        </Pressable>

                        <Pressable onPress={togglePlay}>
                            {isPlaying ? (
                                <Pause size={36} color="white" fill="white" /> 
                                ) : (
                                <Play size={36} color="white" fill="white" />
                            )} 
                        </Pressable>

                        <Pressable onPress={nextSong}>
                            <SkipForward size={24} color="white" fill="white" /> 
                        </Pressable>
                    </View>
                </Pressable>
            </LinearGradient>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: 20,
        borderTopWidth: 1,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: "#494a60",
    },
    title: {
        fontSize: 17,
        fontWeight: 700,
        color: "#ffffff",
    },
    artist: {
        fontSize: 14,
        fontWeight: 300,
        color: "#ffffff"
    },
    songCover: {
        width: 60,
        height: 60,
        borderRadius: 7,
        borderWidth: 0.5,
        borderColor: "#777",
    }, 
    
    btnWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: 10,
    }
});
