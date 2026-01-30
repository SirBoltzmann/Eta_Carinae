// app/_layout.tsx
import { Stack } from 'expo-router';
import { NativeAnimation } from '../src/components/NativeAnimation';
import { PlayerProvider } from '../src/store/playerStore';
import PlayerLayout from '../src/components/PlayerLayout/PlayerLayout';
import Header from '../src/components/Header/Header';
import { View, Image, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import * as SplashScreen from "expo-splash-screen";
import Animated from 'react-native-reanimated';
import { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';

// Evita que el splash nativo se vaya solo
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [ appReady, setAppReady ] = useState<boolean>(false);
	const [ splashVisible, setSplashVisible ] = useState<boolean>(true);
	const { width } = useWindowDimensions();
	const imageWidth = width * 0.9;

	const opacity = useSharedValue(1);
	const scale = useSharedValue(1);

	useEffect(() => {
		async function prepare() {
			try {
				await new Promise(resolve => setTimeout(resolve, 2000));
			} catch (e) {
				console.warn(e);
			} finally {
				setAppReady(true);
				await SplashScreen.hideAsync();

				opacity.value = withDelay(500, withTiming(0, { duration: 1000 }, () => {
					runOnJS(setSplashVisible)(false);
				}));
				scale.value = withTiming(1.5, { duration: 1500 });
			}
		}
		prepare();
	}, []);

	const splashAnimatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ scale: scale.value }],
	}));

	return (
		<GestureHandlerRootView>
			<PlayerProvider>
				<View style={{ flex: 1 }}> 
					<NativeAnimation />

					<View style={{ flex: 1 }}>
						<Header />
						<Stack
							screenOptions={{
							headerShown: false,
							animation: 'none',
							contentStyle: { backgroundColor: 'transparent' }, 
							}}
						/>
						<PlayerLayout/> 
					</View>

					{splashVisible && (
						<Animated.View
							pointerEvents={'none'}
							style={[StyleSheet.absoluteFill, styles.splashContainer, splashAnimatedStyle]}
						>
							<Animated.Image 
								source={require("../assets/splash-icon.png")}
								style={{
									width: imageWidth,
									height: imageWidth, 
									alignSelf: "center", 
									maxWidth: 200,
									maxHeight: 200,
									borderRadius: 16,
									borderWidth: 0.3,
									borderColor: "#777",
									marginBottom: 10,
								}}
							/>
							<Animated.Text style={styles.splashText}>
								Eta Carinae
							</Animated.Text>
						</Animated.View>
					)}
				</View>
			</PlayerProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	splashContainer: {
		backgroundColor: '#070105',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 9999,
	},
	splashText: {
		color: '#fff',
		fontSize: 24,
		fontWeight: 'bold',
	},
	subtitle: {
		color: '#999',
		fontSize: 14,
		marginTop: 10,
		letterSpacing: 1,
	}
});