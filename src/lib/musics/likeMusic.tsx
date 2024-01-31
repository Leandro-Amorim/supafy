import { AuthErrorState } from "@/types/UI/AuthErrorState";
import { LibraryState } from "@/types/UI/LibraryState";
import { CreateToastFnReturn } from "@chakra-ui/react";
import { User } from "@supabase/auth-helpers-nextjs";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import fetchAPI from "../fetchAPI";
import { GenericAPIResponse } from "@/types/GenericAPIResponse";
import { updateLibrary } from "../library/updateLibrary";
import { refreshData } from "../utils";

export const likeMusic = async function (user: User | null, musicId: string, liked: boolean, setLiked: Dispatch<SetStateAction<boolean>> | null,
	setAuthError: Dispatch<SetStateAction<AuthErrorState>>, setLibrary: Dispatch<SetStateAction<LibraryState>>, toast: CreateToastFnReturn, router: NextRouter) {

	if (!user) {
		setAuthError({
			showingError: true,
			errorMessage: 'Log in to add this to your Liked Songs.'
		});
		return;
	}
	setLiked?.(!liked);

	const resp = await fetchAPI<GenericAPIResponse, { like: boolean, musicId: string }>('musics/like_music', { musicId, like: !liked });

	if (resp.status === 'success') {
		toast({
			status: 'info',
			description: <span>{liked ? 'Removed from ' : 'Added to '} <b>Liked Songs</b></span>,
		});
		updateLibrary(setLibrary);
	}
	else {
		setLiked?.(liked);
	}

	if (router.asPath?.includes('/playlist/liked')) {
		refreshData(router);
	}
}