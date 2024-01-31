import { SearchResults } from '@/types/UI/SearchState';
import relevancy from 'relevancy';

export const calculateResultsRelevancy = function (input: string, results: SearchResults) {

	let list = [];
	let sortedMusics = [];
	let sortedArtists = [];
	let sortedPlaylists = [];

	for (const artist of results.artists ?? []) {
		const weight = relevancy.weight(input, artist.name);
		const obj = {
			...artist,
			weight,
			type: 'artist'
		}
		list.push(obj);
		sortedArtists.push(obj);
	}

	for (const music of results.musics ?? []) {
		const nameWeight = relevancy.weight(input, music.name);
		const artistWeight = relevancy.weight(input, music.artist_name) * 0.5;
		const albumWeight = relevancy.weight(input, music.album_name) * 0.3;
		const weight = Math.max(nameWeight, artistWeight, albumWeight);
		const obj = {
			...music,
			weight,
			type: 'music'
		}
		list.push(obj);
		sortedMusics.push(obj);
	}

	for (const playlist of results.playlists ?? []) {
		const weight = relevancy.weight(input, playlist.name);
		const obj = {
			...playlist,
			weight,
			type: 'playlist'
		}
		list.push(obj);
		sortedPlaylists.push(obj);
	}

	list.sort((a, b) => b.weight - a.weight);
	sortedMusics.sort((a, b) => b.weight - a.weight);
	sortedPlaylists.sort((a, b) => b.weight - a.weight);
	sortedArtists.sort((a, b) => b.weight - a.weight);

	return {
		topResult: structuredClone(list[0] ?? {}),
		results: {
			musics: sortedMusics,
			playlists: sortedPlaylists,
			artists: sortedArtists,
		}
	}
}