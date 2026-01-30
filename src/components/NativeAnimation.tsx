import { View, StyleSheet, Dimensions } from "react-native";
import { useEffect, useMemo, useRef } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

type Star = {
    id: number,
    x: number, 
    y: number,
    size: number,
    blinkGroup: "group-one" | "group-two",
};

function BlikingStar ({ star }: { star: Star }) {
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, {
                duration: star.blinkGroup === "group-one" ? 3109 : 1728,
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.star,
                animatedStyle,
                {
                    top: star.y,
                    left: star.x,
                    width: star.size,
                    height: star.size,
                    borderRadius: star.size / 2,
                },
            ]}
        />
    )
}

export function NativeAnimation() {
    const stars = useMemo<Star[]>(() => {
        const total = 350;
        return Array.from({ length: total }, (_, i) => ({
            id: i,
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3.4,
            blinkGroup: i % 2 === 0 ? "group-one" : "group-two",
        }));
    }, []);

    return (
        <LinearGradient
            colors={["#22112e", "#070105", "#22112e"]}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={{ flex: 1 }}>
                {stars.map((star) => (
                    <BlikingStar key={star.id} star={star}/>
                ))}
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    star: {
        position: "absolute",
        backgroundColor: "white",
    },
});
