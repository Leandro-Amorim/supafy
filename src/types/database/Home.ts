import { BasicPlaylist } from "./BasicPlaylist";
import { PopularPlaylist } from "./PopularPlaylist";

export interface DataHome {
	history: Array<BasicPlaylist> | null,
	featured: Array<BasicPlaylist> | null,
	popular: Array<PopularPlaylist> | null
}