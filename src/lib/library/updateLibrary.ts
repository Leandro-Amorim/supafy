import { LibraryState } from "@/types/UI/LibraryState";
import { Dispatch, SetStateAction } from "react";
import fetchAPI from "../fetchAPI";
import { APIResponse } from "@/pages/api/library/get_library";

export const updateLibrary = async function (setLibrary: Dispatch<SetStateAction<LibraryState>>) {

	const resp = await fetchAPI<APIResponse, null>('library/get_library');

	if (resp.status === 'success') {
		setLibrary((prev) => { return { ...prev, playlists: resp.data ?? [] } });
	}
	else {
		setLibrary((prev) => { return { ...prev, playlists: [] } });
	}
}