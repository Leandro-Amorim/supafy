import { BasicPlaylist } from "./BasicPlaylist";

export interface PopularPlaylist extends BasicPlaylist {
	save_count: number,
}