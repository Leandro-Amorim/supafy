import { ContextMenuParams } from "@/types/UI/ContextMenuParams";
import { MusicContextState } from "@/types/UI/MusicContextState";
import { CurrentMusic } from "@/types/UI/QueueState";
import { BasicPlaylist } from "@/types/database/BasicPlaylist";
import { MusicInfo } from "@/types/database/MusicInfo";
import { Playlist } from "@/types/database/Playlist";
import { PlaylistMusic } from "@/types/database/PlaylistMusic";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, MouseEvent, SetStateAction } from "react";

export const openMusicContextMenu = function (event: MouseEvent, user: User | null, playlist: BasicPlaylist | Playlist | undefined | null,
	music: PlaylistMusic | MusicInfo | CurrentMusic, liked: boolean, setLiked: Dispatch<SetStateAction<boolean>>,
	setMusicContext: Dispatch<SetStateAction<MusicContextState>>, show: (params: ContextMenuParams) => void, isQueue?: boolean) {
	setMusicContext({
		playlistId: playlist?.id ?? null,
		musicId: music.id ?? '',
		artistId: music.artist_id ?? '',
		isOwner: playlist?.author_id ? playlist.author_id == user?.id : false,
		liked: liked,
		setLiked: setLiked,
		isQueue: isQueue ?? false
	})
	show({ event });
}
