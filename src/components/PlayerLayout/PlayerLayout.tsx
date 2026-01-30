import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { usePlayer } from '../../store/playerStore';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import MiniPlayer from '../MiniPlayer/MiniPlayer';
import FullPlayer from '../FullPlayer/FullPlayer';

export default function PlayerLayout() {
  	const { isExpanded, currentSong } = usePlayer();
	const { height: screenHeight } = useWindowDimensions();

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: withSpring(
				!currentSong ? 0 : isExpanded ? screenHeight : 80,
				{ damping: 55, stiffness: 100 }
			),
		};
  });

	return (
		<Animated.View  style={[styles.mainContainer, animatedStyle]}> 
			{!isExpanded ?
				<MiniPlayer/> :
				<FullPlayer/>
			}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#070105',
		overflow: 'hidden',
		zIndex: 999,
	},
});
