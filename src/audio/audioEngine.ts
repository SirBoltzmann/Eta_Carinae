import { Audio, AVPlaybackStatus } from 'expo-av';

let sound: Audio.Sound | null = null;

export async function load(source: any) {
    if (sound) {
        await sound.unloadAsync();
        sound = null;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: false },
        undefined
    );

    sound = newSound;
}

export async function play() {
    if (!sound) return;
    await sound.playAsync();
}

export async function pause() {
    if (!sound) return;
    await sound.pauseAsync();
}

export async function stop() {
    if (!sound) return;
    await sound.stopAsync();
}

export async function getStatus(): Promise<AVPlaybackStatus | null> {
    if (!sound) return null;
    return await sound.getStatusAsync();
}

export async function unload() {
    if (!sound) return;
    await sound.unloadAsync();
    sound = null;
}