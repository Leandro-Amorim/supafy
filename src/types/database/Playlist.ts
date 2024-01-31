import { BasicPlaylist } from "./BasicPlaylist"
import { PlaylistMusic } from "./PlaylistMusic"

export interface Playlist extends BasicPlaylist {
	musics: PlaylistMusic[]
	save_count: number,
	created_at: string,
	genre_data: {
		[key: string]: number
	}
}