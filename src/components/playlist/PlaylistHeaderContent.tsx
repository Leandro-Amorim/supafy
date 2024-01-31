import { Flex, Text } from "@chakra-ui/react";
import PlayButton from "../shared/buttons/PlayButton";
import { useRecoilState, useSetRecoilState } from "recoil";
import { libraryState, playerState, queueState } from "@/lib/atoms";
import { addPlaylistToQueue } from "@/lib/playerUtils";
import { Playlist } from "@/types/database/Playlist";
import { MouseEvent } from "react";

export default function PlaylistHeaderContent({ playlist }: { playlist: Playlist }) {

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);
	const setLibrary = useSetRecoilState(libraryState);

	function play(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
		addPlaylistToQueue(playlist.id, null, true, queue, setQueue, player, setPlayer, setLibrary);
	}

	const playing = queue.currentMusic.playlist_id === playlist.id && player.playing;

	return (
		<Flex w={'100%'} h={'100%'} alignItems={'center'} gap={'8px'}>
			<PlayButton size={'48px'} playIconSize={'24px'} pauseIconSize={'28px'} onClick={play} playing={playing} />
			<Text fontSize={'24px'} fontWeight={700} color={'white'} noOfLines={1}>{playlist.name}</Text>
		</Flex>
	)
}