import { AuthErrorState } from "@/types/UI/AuthErrorState";
import { CreateToastFnReturn } from "@chakra-ui/react";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";
import fetchAPI from "../fetchAPI";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";

export const addMusicToPlaylist = async function (user: User | null, playlistId: string, musicId: string, playlistName: string,
	setAuthError: Dispatch<SetStateAction<AuthErrorState>>, toast: CreateToastFnReturn) {

	if (!user) {
		setAuthError({
			showingError: true,
			errorMessage: 'Log in to add this to your playlists.'
		});
		return;
	}

	const resp = await fetchAPI<GenericAPIResponse, { playlistId: string, musicId: string, add: boolean }>('musics/add_music', { playlistId, musicId, add: true });

	if (resp.status === 'success' && playlistName) {
		toast({
			status: 'info',
			description: <span>{'Added to '} <b>{playlistName}</b></span>
		});
	}
}
