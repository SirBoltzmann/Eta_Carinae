import { View, Text, StyleSheet, Pressable } from 'react-native';
import SongItem from '../SongItem/SongItem';
import { Song } from '../../types/music';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOutUp, LinearTransition, useAnimatedStyle, withTiming } from 'react-native-reanimated';


type GenreListProps = {
    title: string;
    songs: Song[];
    defaultOpen: boolean;
};

export default function GenreList({ title, songs, defaultOpen }: GenreListProps) {
    const [ isDisplayed, setIsDisplayed ] = useState<Boolean>(defaultOpen);

    const chevronStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: withTiming(isDisplayed ? '180deg' : '0deg', { duration: 300 }) }
            ],
        };
    });

    return (
        <View style={styles.container}>
            <Pressable onPress={( ) => setIsDisplayed(!isDisplayed)} style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Animated.View style={chevronStyle}>
                    <ChevronDown strokeWidth={4} size={28} color={"#fff"}/>
                </Animated.View>
            </Pressable>

            {isDisplayed && (
                <Animated.View
                    entering={FadeInUp.duration(300)} 
                    exiting={FadeOutUp.duration(300)}
                    layout={LinearTransition}
                    style={styles.listContainer}
                >
                    {songs.map(song => (
                        <SongItem key={song.id} song={song} playlist={songs}/>
                    ))}
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginBottom: 10,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderBottomWidth: 1, 
        borderColor: "#777",
        borderRadius: 15,
        marginBottom: 10,

    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: "#fff",
        letterSpacing: 0.5,
    },
    listContainer: {
        gap: 2,
    }
});