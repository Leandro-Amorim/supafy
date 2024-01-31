import { LibraryState } from "@/types/UI/LibraryState";
import { Dispatch, SetStateAction } from "react";
import { updateLibrary } from "./updateLibrary";
import fetchAPI from "../fetchAPI";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";

export const updateLibraryHistory = async function (playlistId: string, setLibrary: Dispatch<SetStateAction<LibraryState>>) {
	const resp = await fetchAPI<GenericAPIResponse, { playlistId: string }>('library/update_library_history', { playlistId });
	updateLibrary(setLibrary);
	return resp.status;
}