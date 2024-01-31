import { AuthErrorState } from "@/types/UI/AuthErrorState";
import { PlaylistModalState } from "@/types/UI/PlaylistModalState";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

export const openCreatePlaylistModal = function (user: User | null, setAuthError: Dispatch<SetStateAction<AuthErrorState>>, setModal: Dispatch<SetStateAction<PlaylistModalState>>) {
	if (!user) {
		setAuthError({
			showingError: true,
			errorMessage: 'Log in to create and share playlists.'
		})
		return;
	}
	setModal((prev) => {
		return {
			...prev,
			playlistId: null,
			open: true,
			create: true,
			name: '',
			imageData: null,
			previewUrl: '',
		}
	});
}