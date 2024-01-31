import { BasicArtist } from "../database/BasicArtist"
import { BasicPlaylist } from "../database/BasicPlaylist"
import { MusicInfo } from "../database/MusicInfo"

export interface SearchState {
	input: string,
	state: 0 | 1 | 2,
	topResult: TopResult,
	results: SearchResults,
}

export type TopResult = (MusicInfo | BasicArtist | BasicPlaylist) & { type: string };

export interface SearchResults {
	musics: MusicInfo[],
	artists: BasicArtist[],
	playlists: BasicPlaylist[],
}