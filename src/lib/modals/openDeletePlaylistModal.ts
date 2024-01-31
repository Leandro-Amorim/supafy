import { PlaylistDeleteModalState } from "@/types/UI/PlaylistDeleteModalState";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

export const openDeletePlaylistModal = function (user: User | null, playlistId: string, name: string, setModal: Dispatch<SetStateAction<PlaylistDeleteModalState>>) {
	if (!user) { return; }

	setModal((prev) => {
		return {
			...prev,
			open: true,
			playlistId,
			name
		}
	});
}