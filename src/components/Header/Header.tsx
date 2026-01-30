import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function Header() {
    return (
        <LinearGradient 
            colors={["#070105", "#190b22"]}
            start={{ x: 0, y: 0 }} 
            end={{ x: 0, y: 1 }} 
            style={styles.headerContainer}
        >
            <SafeAreaView edges={["top"]}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>My Music</Text>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        zIndex: 99,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.15)",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    headerContent: {
        justifyContent: 'center',
        paddingTop: 15,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    headerTitle: {
        color: 'white',
        fontSize: 26,
        fontWeight: '800',
    },
});