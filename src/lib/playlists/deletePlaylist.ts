import { LibraryState } from "@/types/UI/LibraryState";
import { PlaylistDeleteModalState } from "@/types/UI/PlaylistDeleteModalState";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import fetchAPI from "../fetchAPI";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";
import { updateLibrary } from "../library/updateLibrary";

export const deletePlaylist = async function (modal: PlaylistDeleteModalState, setModal: Dispatch<SetStateAction<PlaylistDeleteModalState>>,
	setLibrary: Dispatch<SetStateAction<LibraryState>>, router: NextRouter) {
	const playlistId = modal.playlistId;

	const resp = await fetchAPI<GenericAPIResponse, { playlistId: string }>('playlists/delete_playlist', { playlistId: playlistId ?? '' });
	updateLibrary(setLibrary);

	setModal((prev) => {
		return {
			...prev,
			playlistId: null,
			name: '',
			open: false
		}
	});

	if (router.asPath.includes(`/playlist/${playlistId}`)) {
		router.push('/');
	}
}
