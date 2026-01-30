import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song } from '../types/music';
import { Audio, AVPlaybackStatus } from 'expo-av';

interface PlayerContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    isExpanded: boolean;
    position: number;
    duration: number;
    isLoading: boolean;
    playSong: (song: Song, playlist: Song[]) => Promise<void>;
    togglePlay: () => Promise<void>;
    nextSong: () => Promise<void>;
    prevSong: () => Promise<void>;
    expand: () => void;
    collapse: () => void;
    seekTo: (ms: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: any) {
    const soundRef = useRef<Audio.Sound | null>(null);

    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [currentPlaylist, setCurrentPlaylist] = useState<Song[] | undefined>();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [position, setPosition] = useState<number>(0);
    const indexRef = useRef(0);
    const loadingRef = useRef(false);

    useEffect(() => {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
        });
    }, []);



    useEffect(() => {
        return () => {
            soundRef.current?.unloadAsync();
        };
    }, []);

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        setPosition(status.positionMillis);
        setDuration(status.durationMillis ?? 0);
        setIsPlaying(status.isPlaying);
        if (status.didJustFinish === true && !loadingRef.current) {
            nextSong();
        }
    };

    const playSong = async (song: Song, playlist?: Song[]) => {
        setIsLoading(true);
        loadingRef.current = true;
        if (soundRef.current) {
            await soundRef.current.unloadAsync();
        }

        if (playlist) {
            const index = playlist.findIndex((s) => s.id === song.id)
            setCurrentPlaylist(playlist);
            setCurrentIndex(index);
            indexRef.current = index;
        };

        const { sound } = await Audio.Sound.createAsync(
            song.src,
            { shouldPlay: true },
            onPlaybackStatusUpdate
        );

        soundRef.current = sound;
        setCurrentSong(song);
        setIsLoading(false);
        loadingRef.current = false;
    };

    const togglePlay = async () => {
        if (!soundRef.current) return;

        const status = await soundRef.current.getStatusAsync();
        if (!status.isLoaded) return;
        
        if (status.isPlaying) {
            await soundRef.current.pauseAsync();
        } else {
            await soundRef.current.playAsync();
        }
    };

    const nextSong = async () => {
        if (!currentPlaylist?.length || loadingRef.current) return;
        setIsLoading(true);
        loadingRef.current = true;
        
        const nextIndex = (indexRef.current + 1) % currentPlaylist.length;
        indexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        await playSong(currentPlaylist[nextIndex]);
    };

    const prevSong = async () => {
        if (!currentPlaylist?.length || isLoading) return;
        setIsLoading(true);
        loadingRef.current = true;

        const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        setCurrentIndex(prevIndex);
        indexRef.current = prevIndex;

        await playSong(currentPlaylist[prevIndex]);
    }

    const seekTo = async (ms: number) => {
        if (!soundRef.current) return;
        await soundRef.current.setPositionAsync(ms);
    };

    return (
        <PlayerContext.Provider
            value={{
                currentSong, isPlaying, isExpanded, playSong, togglePlay, nextSong, prevSong,
                expand: () => setIsExpanded(true),
                collapse: () => setIsExpanded(false),
                duration, position, seekTo, isLoading
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    const context = useContext(PlayerContext);

    if (context === undefined) {
        throw new Error("Useplayer debe usarse dentro de un player provider.. ")
    }

    return context;
};