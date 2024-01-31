import { AuthErrorState } from "@/types/UI/AuthErrorState";
import { LibraryState } from "@/types/UI/LibraryState";
import { CreateToastFnReturn } from "@chakra-ui/react";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";
import fetchAPI from "../fetchAPI";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";
import { updateLibrary } from "../library/updateLibrary";

export const savePlaylist = async function (user: User | null, playlistId: string, saved: boolean, setSaved: Dispatch<SetStateAction<boolean>> | null,
	setAuthError: Dispatch<SetStateAction<AuthErrorState>>, setLibrary: Dispatch<SetStateAction<LibraryState>>, toast: CreateToastFnReturn) {

	if (!user) {
		setAuthError({
			showingError: true,
			errorMessage: 'Log in to save this playlist.'
		});
		return;
	}
	if (setSaved) { setSaved(!saved) }

	const resp = await fetchAPI<GenericAPIResponse, { playlistId: string, save: boolean }>('playlists/save_playlist', { playlistId, save: !saved });

	if (resp.status === 'success') {
		toast({
			status: 'info',
			description: <span>{saved ? 'Removed from ' : 'Saved to '} <b>Your Library</b></span>
		});
		updateLibrary(setLibrary);
	}
	else {
		if (setSaved) { setSaved(saved); }
	}
}