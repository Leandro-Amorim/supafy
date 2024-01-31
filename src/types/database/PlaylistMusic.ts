import { MusicInfo } from "./MusicInfo";

export interface PlaylistMusic extends MusicInfo {
	music_order: number,
	added_at: string,
}