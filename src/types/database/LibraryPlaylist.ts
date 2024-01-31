import { BasicPlaylist } from "./BasicPlaylist";

export interface LibraryPlaylist extends Omit<BasicPlaylist, 'saved_by_me' | 'color'> {
	last_played_at: string,
	added_at: string
}