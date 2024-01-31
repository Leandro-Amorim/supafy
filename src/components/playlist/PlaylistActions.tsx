import { Flex, useToast } from "@chakra-ui/react";
import PlayButton from "../shared/buttons/PlayButton";
import LikeButton from "../shared/buttons/LikeButton";
import EllipsisButton from "../shared/buttons/EllipsisButton";
import { useUser } from "@supabase/auth-helpers-react";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { libraryState, authErrorState, playlistContextState, queueState, playerState } from "@/lib/atoms";
import { useContextMenu } from "react-contexify";
import { addPlaylistToQueue } from "@/lib/playerUtils";
import { Playlist } from "@/types/database/Playlist";
import { savePlaylist } from "@/lib/playlists/savePlaylist";
import { openPlaylistContextMenu } from "@/lib/context-menus/openPlaylistContextMenu";

export default function PlaylistActions({ playlist }: { playlist: Playlist }) {

	const setPlaylistContext = useSetRecoilState(playlistContextState);
	const setAuthError = useSetRecoilState(authErrorState);
	const setLibrary = useSetRecoilState(libraryState);

	const user = useUser();
	const [saved, setSaved] = useState(false);

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);
	const toast = useToast();

	useEffect(() => {
		setSaved(playlist.saved_by_me);
	}, [playlist.saved_by_me]);

	function onSave() {
		savePlaylist(user, playlist.id, saved, setSaved, setAuthError, setLibrary, toast);
	}

	const { show } = useContextMenu({ id: 'playlist', });
	function openContextMenu(event: MouseEvent<HTMLDivElement>) {
		openPlaylistContextMenu(event, user, playlist, saved, setSaved, setPlaylistContext, show);
	}

	function play(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
		addPlaylistToQueue(playlist.id, null, true, queue, setQueue, player, setPlayer, setLibrary);
	}

	const playing = queue.currentMusic.playlist_id === playlist.id && player.playing;

	return (
		<Flex className="items-center pl-1 py-6 gap-8">
			<PlayButton size={'56px'} playIconSize={'28px'} pauseIconSize={'32px'} onClick={play} playing={playing} />
			<Flex className={'gap-6'}>
				{
					playlist.id !== 'liked' && playlist.author_id !== user?.id ? <LikeButton onClick={onSave} liked={saved} size={'32px'} iconSize={'32px'} /> : []
				}
				{
					playlist.id !== 'liked' && <EllipsisButton onClick={openContextMenu} size={'32px'} iconSize={'32px'} />
				}
			</Flex>
		</Flex>
	)
}