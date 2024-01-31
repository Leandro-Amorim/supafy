import { BasicPlaylist } from "./BasicPlaylist";
import { BasicProfile } from "./BasicProfile";

export interface Profile extends BasicProfile {
	playlists: BasicPlaylist[]
}