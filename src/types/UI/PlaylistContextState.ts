import { Dispatch, SetStateAction } from "react";

export interface PlaylistContextState {
	playlistId: string,
	name: string,
	imageUrl: string,
	saved: boolean,
	setSaved: Dispatch<SetStateAction<boolean>> | null,
	isOwner: boolean,
}