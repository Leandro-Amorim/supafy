import { PlaylistModalState } from "@/types/UI/PlaylistModalState";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

export const openEditPlaylistModal = function (user: User | null, playlistId: string, name: string, imageUrl: string, setModal: Dispatch<SetStateAction<PlaylistModalState>>) {
	if (!user) { return; }
	setModal((prev) => {
		return {
			...prev,
			playlistId,
			open: true,
			create: false,
			name,
			imageData: null,
			previewUrl: imageUrl ?? '',
		}
	});
}
