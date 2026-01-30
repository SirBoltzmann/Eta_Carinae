import { MusicLibrary } from '../types/music';


export const musicLibrary: MusicLibrary = {
    synthwave: {
        title: "Synthwave",
        songs: [
            {
                id: "mars-132",
                title: "Mars One",
                artist: "Aura",
                coverUrl: require("../../assets/images/synthwave-covers/mars-132_aura.png"),
                src: require("../../assets/songs/synthwave-songs/mars-132_aura.mp3"),
            },
            // And your other songs.....
        ]
    },

    trance: {
        title: "Trance",
        songs: [
            {
                id: "emptyness",
                title: "Emptyness",
                artist: "Auriga",
                coverUrl: require("../../assets/images/trance-covers/emptyness_auriga.png"),
                src: require("../../assets/songs/trance-songs/emptyness_auriga.mp3"),
            },
        ]
    },
}