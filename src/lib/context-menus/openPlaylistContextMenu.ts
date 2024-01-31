import { ContextMenuParams } from "@/types/UI/ContextMenuParams";
import { PlaylistContextState } from "@/types/UI/PlaylistContextState";
import { BasicPlaylist } from "@/types/database/BasicPlaylist";
import { LibraryPlaylist } from "@/types/database/LibraryPlaylist";
import { Playlist } from "@/types/database/Playlist";
import { PopularPlaylist } from "@/types/database/PopularPlaylist";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, MouseEvent, SetStateAction } from "react";

export const openPlaylistContextMenu = function (event: MouseEvent, user: User | null, playlist: BasicPlaylist | LibraryPlaylist | PopularPlaylist | Playlist,
	saved: boolean, setSaved: Dispatch<SetStateAction<boolean>> | null, setPlaylistContext: Dispatch<SetStateAction<PlaylistContextState>>, show: (params: ContextMenuParams) => void) {

	setPlaylistContext({
		playlistId: playlist.id,
		isOwner: playlist.author_id == user?.id,
		saved: saved,
		name: playlist.name,
		imageUrl: playlist.image_url ?? '',
		setSaved: setSaved,
	})
	show({ event });
}