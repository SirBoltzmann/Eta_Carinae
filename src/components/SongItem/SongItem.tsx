import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { usePlayer } from '../../store/playerStore';
import { Song } from '../../types/music';
import { BlurView } from 'expo-blur';
import { AudioLines, Play } from 'lucide-react-native';
type Props = {
    song: Song;
    playlist: Song[];
};

export default function SongItem({ song, playlist }: Props) {
    const { playSong, currentSong, isPlaying, expand } = usePlayer();

    const isCurrent = currentSong?.id === song.id;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isCurrent && styles.active,
            ]}
            onPress={() => {
                playSong(song, playlist);
                expand();
            }}
        >
            <Image
                source={song.coverUrl}
                style={styles.songCover}
            ></Image>
            <View style={styles.glassContainer}>
                <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
                    
                <View style={styles.songContent}>
                    <View style={styles.songText}>
                        <Text style={styles.songTitle}>{song.title}</Text>
                        <Text style={styles.songArtist}>{song.artist}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        {isPlaying && isCurrent ? 
                            <AudioLines size={28} color={"#fff"} fill={"#fff"}/> :
                            <Play size={28} color={"#fff"} fill={"#fff"}/>
                        }
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 4,
        flexDirection: "row",
        gap: 13,
    },

    active: {
        opacity: 0.7,
    },

    songCover: {
        width: 75,
        height: 75,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#555",
    },

    glassContainer: {
        flex: 1,
		marginBottom: 15,
		borderRadius: 20,
		overflow: 'hidden', 
		borderWidth: 1.5,
		borderColor: 'rgba(255, 255, 255, 0.25)',
	},

    songContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

	songText: {
        flex: 1,
		flexDirection: "column",
		padding: 10,
		marginBottom: 4,
		borderRadius: 10,
	},

	songTitle: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '700',
        marginLeft: 10,
	},

	songArtist: {
		marginTop: 5,
		color: '#b3b3c6',
		fontSize: 14,
        fontWeight: 300,
        marginLeft: 10,
	},
    
    iconContainer: {
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
});


