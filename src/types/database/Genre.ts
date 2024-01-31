import { BasicGenre } from "./BasicGenre";
import { BasicPlaylist } from "./BasicPlaylist";

export interface Genre extends BasicGenre {
	playlists: BasicPlaylist[]
}