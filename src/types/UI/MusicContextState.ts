import { Dispatch, SetStateAction } from "react";

export interface MusicContextState {
	musicId: string,
	playlistId: string | null,
	artistId: string,
	liked: boolean,
	setLiked: Dispatch<SetStateAction<boolean>> | null,
	isOwner: boolean,
	isQueue: boolean
}