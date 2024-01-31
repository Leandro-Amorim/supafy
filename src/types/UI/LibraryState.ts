import { LibraryPlaylist } from "../database/LibraryPlaylist";

export interface LibraryState {
	viewMode: string;
	sortMode: string;
	search: string;
	playlists: LibraryPlaylist[];
}
