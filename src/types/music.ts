import { ImageSourcePropType } from 'react-native';

export interface Song {
    id: string;
    title: string;
    artist: string;
    coverUrl: ImageSourcePropType;
    src: any;
}

export interface Genre {
    title: string;
    songs: Song[];
}

export interface MusicLibrary {
    [key: string]: Genre;
}