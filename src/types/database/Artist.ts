import { BasicArtist } from "./BasicArtist";
import { MusicInfo } from "./MusicInfo";

export interface Artist extends BasicArtist {
	musics: MusicInfo[]
}