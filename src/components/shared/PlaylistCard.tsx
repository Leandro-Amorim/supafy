import { Box, Center, Flex, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import CardPlayButton from "../sidebar/buttons/CardPlayButton";
import { RiMusic2Line } from "react-icons/ri";
import { useUser } from "@supabase/auth-helpers-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { libraryState, playerState, playlistContextState, queueState } from "@/lib/atoms";
import { useContextMenu } from "react-contexify";
import Link from "next/link";
import { addPlaylistToQueue } from "@/lib/playerUtils";
import { BasicPlaylist } from "@/types/database/BasicPlaylist";
import { Playlist } from "@/types/database/Playlist";
import { openPlaylistContextMenu } from "@/lib/context-menus/openPlaylistContextMenu";

export default function PlaylistCard({ playlist }: { playlist: BasicPlaylist | Playlist }) {

	const user = useUser();

	const [hover, setHover] = useState(false);
	const [saved, setSaved] = useState(false);

	const setPlaylistContext = useSetRecoilState(playlistContextState);

	const [queue, setQueue] = useRecoilState(queueState);
	const [player, setPlayer] = useRecoilState(playerState);
	const setLibrary = useSetRecoilState(libraryState);

	useEffect(() => {
		setSaved(playlist.saved_by_me);
	}, [playlist.saved_by_me]);

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
		<LinkBox onContextMenu={openContextMenu} onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }} role={'button'} borderRadius={'6px'} transition={'background-color .3s ease'} background={'#181818'} padding={'16px'} w={'100%'}
			_hover={{
				bg: '#282828'
			}}
		>
			<LinkOverlay href={`/playlist/${playlist.id}`} as={Link}>
				<Box w={'100%'} aspectRatio={1} position={"relative"} overflow={"hidden"} borderRadius={'4px'} marginBottom={'16px'} boxShadow={'0 8px 24px rgba(0,0,0,.5)'}>
					{
						playlist.image_url ? <Image fill={true} className="object-cover" alt="playlist" src={playlist.image_url} /> :
							<Center boxSize={'100%'} className="bg-container-light"><RiMusic2Line size={'64px'} color='#7f7f7f' /></Center>
					}
					<CardPlayButton hover={hover || playing} onClick={play} playing={playing} />
				</Box>

				<Flex minH={'62px'} w={'100%'} direction={'column'} align={'flex-start'}>
					<Text fontSize={'16px'} fontWeight={700} color={'white'} noOfLines={1} paddingBottom={'4px'}>{playlist.name}</Text>
					<Text fontSize={'14px'} color={'#a7a7a7'} noOfLines={1}>{'By ' + playlist.author_name}</Text>
				</Flex>
			</LinkOverlay>
		</LinkBox>
	)
}