import { ScrollView } from 'react-native';
import { musicLibrary } from '../src/data/musicLibrary';
import GenreList from '../src/components/GenreList/GenreList';
import { useMemo } from 'react';

export default function Home() {
	const randomGenreTitle = useMemo(() => {
		const genres = Object.values(musicLibrary);
		console.log(genres);

		const randomIndex = Math.floor(Math.random() * genres.length);
		console.log(randomIndex);
		console.log(genres[randomIndex].title);
		return genres[randomIndex].title;
	}, [])

	return (
		<ScrollView style={{ marginBottom: 80 }} >
			{Object.entries(musicLibrary).map(([key, genre]) => (
				<GenreList
					key={key}
					title={genre.title}
					songs={genre.songs}
					defaultOpen={genre.title === randomGenreTitle ? true : false}
				/>
			))}
		</ScrollView>
	);
};