import { APIResponse } from "@/pages/api/playlists/get_all_playlists";
import fetchAPI from "../fetchAPI";
import { Dispatch, SetStateAction } from "react";

export const updatePlaylistEntries = async function (setPlaylists: Dispatch<SetStateAction<Array<{ id: string, name: string }>>>) {

	const resp = await fetchAPI<APIResponse, null>('playlists/get_all_playlists', null, 'POST');

	if (resp.status === 'success') {
		setPlaylists(resp.data);
	}
	else {
		setPlaylists([]);
	}

}