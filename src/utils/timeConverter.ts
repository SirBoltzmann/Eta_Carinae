export const milisecondsToSeconds = (ms: number) => {
    const seconds = ms / 1000;
    return seconds;
}

export const secondsToMinutes = (seconds: number) => {
    const minutes = seconds / 60;
    return minutes;
}

export const formatDuration = (ms: number): string => {
    if (isNaN(ms)) return "0:00";

    const seconds = milisecondsToSeconds(ms);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const s = secs.toString().padStart(2, "0");

    if (hours > 0) {
        const m = minutes.toString().padStart(2, "0");
        return `${hours}:${m}:${s}`;
    }

    return `${minutes}:${s}`; 
}